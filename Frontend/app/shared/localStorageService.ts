import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Enterprise} from "./enterprise"
import {Participant} from "./participant";
import {Place} from "./place";
import {MediaItem} from "./mediaItem";
import {SimpleMediaItem} from "./simpleMediaItem";
import {LocalDatabaseService} from "./localDatabaseService";
import {knownFolders, File, Folder, path} from "file-system";
import {Mapbox, MapStyle, OfflineRegion} from "nativescript-mapbox";
import {SecretConfig} from "../secretConfig";
import appSettings = require("application-settings");
import * as app from "tns-core-modules/application";
var http = require("http");

@Injectable()
export class LocalStorageService{

    private static readonly mediaFolder : Folder = Folder.fromPath(path.join(knownFolders.documents().path, "media"));
    //Extra bit of map around all places, in degrees
    private static readonly mapBoundaryDegrees : number = 0.0001;

    constructor(private localDatabaseService:LocalDatabaseService){
    }

    getImagePath(filename: string, url: string) : string{
        //Preference will be to load it from a local file
        if (filename){
            var filePath = path.join(LocalStorageService.mediaFolder.path, filename);
            if (File.exists(filePath)){
                return filePath;
            }
        }
        return url;
    }

    saveEnterprise(enterpriseWithoutDetail : Enterprise, enterpriseToSave : Enterprise) : Promise<any>{
        let localStorageService = this;
        //Empty promise makes chaining easier.
        var promise : Promise<any> = Promise.resolve(0);

        let mediaItems = enterpriseToSave.getMediaToDownload();
        enterpriseWithoutDetail.totalThingsToDownload = 
            mediaItems.length + enterpriseToSave.participants.length; //media plus a map per participant
        
        if (!this.loadStream())
        {
            //Download media, updating progress bar after each one
            for(let m of mediaItems){
                (function(mediaItem : SimpleMediaItem){
                    if (mediaItem.url && mediaItem.filename){
                        promise = promise.then(x =>{
                            let mediaItemPath = path.join(LocalStorageService.mediaFolder.path, mediaItem.filename);
                            if (app.ios){
                                return localStorageService.saveMediaItemIOS(mediaItem.url, mediaItemPath);
                            }
                            else {
                                return localStorageService.saveMediaItemAndroid(mediaItem.url,mediaItemPath);
                            }
                        })
                        .then(y => enterpriseWithoutDetail.setNumberDownloaded(enterpriseWithoutDetail.numberDownloaded + 1));
                    }
                })(m);
            }

            //Download maps
            promise = this.downloadMaps(enterpriseWithoutDetail, enterpriseToSave, promise);
        }
            
        //Save to local DB last, because this is harder to recover from
        promise = promise.then(x => this.localDatabaseService.saveEnterprise(enterpriseToSave));

        promise.catch(err => {
            console.log("Error: ", JSON.stringify(err));
            return Observable.throw(err);
        });
        
        return promise;
    }

    private saveMediaItemIOS(url: string, destinationPath: string) : Promise<any>{
        return http.getFile(url, destinationPath);
    }

    private saveMediaItemAndroid(url: string, destinationPath: string) : Promise<any>{
        return new Promise<any>((resolve, reject) => {
            var worker = new Worker('./androidDownloadMediaItemWorker');
            worker.postMessage({url: url, destination: destinationPath});
            worker.onmessage = function(msg){
                if (msg.data.success){
                    resolve();
                }
                reject();
            }
            worker.onerror = function(err){
                console.log(`An unhandled error occurred in worker: ${err.filename}, line: ${err.lineno} :`);
                console.log(err.message);
                reject();
            }
        });
    }

    deleteEnterprise(enterpriseToDelete: Enterprise) : Promise<any>{
        var enterprise: Enterprise;
        var mediaItems: Array<SimpleMediaItem>;
        var promise: Promise<any> = this.localDatabaseService.getSavedEnterprise(enterpriseToDelete.id)
            .then(e => enterprise = e);
        //Delete from local database
        promise = promise.then(x => this.localDatabaseService.deleteEnterprise(enterpriseToDelete.id));
        
        //Delete media
        promise = promise.then(x => {
            mediaItems = enterprise.getMediaToDownload();
            var promiseList: Array<Promise<any>> = [];
            for (let m of mediaItems){
                (function(mediaItem: SimpleMediaItem){
                    let filePath = path.join(LocalStorageService.mediaFolder.path, mediaItem.filename);
                    if (mediaItem.filename 
                        && File.exists(filePath)){
                            var file = LocalStorageService.mediaFolder.getFile(mediaItem.filename);
                            promiseList.push(file.remove());
                    }
                })(m);
            }
            return Promise.all(promiseList);
        });

        //Delete maps
        var mapbox = new Mapbox();
        var savedMapRegions: Array<OfflineRegion>;
        promise = promise.then(x => mapbox.listOfflineRegions())
            .then(regions => {
                savedMapRegions = regions; 
            });
        promise = promise.then(x => {
            var promiseList : Array<Promise<any>> = [];
            for (let p of enterprise.participants){
                (function(participant: Participant){
                    let regionName = "E" + enterprise.id + "P" + participant.id;
                    if (savedMapRegions.some(r => r.name === regionName)){
                        promiseList.push(mapbox.deleteOfflineRegion({name: regionName}));
                    }
                })(p);
            }
            return Promise.all(promiseList);
        });

        return promise;
    }

    private downloadMaps(enterpriseWithoutDetail: Enterprise, enterpriseToSave: Enterprise, promise: Promise<any>) : Promise<any>
    {
        //Download mapbox region        
        for(let p of enterpriseToSave.participants){
            (function(participant : Participant){
                if (participant.places.length > 0){
                    promise = promise.then(x =>{
                        var progressToDate = enterpriseWithoutDetail.numberDownloaded;
                        return new Mapbox().downloadOfflineRegion({
                            accessToken: SecretConfig.mapboxAccessToken,
                            name: "E" + enterpriseToSave.id + "P" + participant.id,
                            style: MapStyle.EMERALD,
                            minZoom: 16,
                            maxZoom: 16,
                            bounds : {
                                north : participant.getMaxNorthBound() + LocalStorageService.mapBoundaryDegrees,
                                east : participant.getMaxEastBound() + LocalStorageService.mapBoundaryDegrees,
                                south : participant.getMaxSouthBound() - LocalStorageService.mapBoundaryDegrees,
                                west: participant.getMaxWestBound() - LocalStorageService.mapBoundaryDegrees
                            },
                            onProgress: function (progress) {
                                //This 'if' condition is needed because of a bug in Mapbox
                                //where it doesn't seem to unsubscribe from previous onProgress callbacks,
                                //meaning that it will keep calling onProgress for ALL maps you've recently downloaded...
                                if (enterpriseWithoutDetail.numberDownloaded < (progressToDate + 1)){
                                    enterpriseWithoutDetail.setNumberDownloaded(progressToDate + (progress.percentage/100.0));
                                }
                            }
                        });
                    });
                }
            })(p);
        }
        return promise;
    }

    /**
     * set whether media and map is streamed or downloaded.
     * true for streamed, false for downloaded.
     */
    public saveStream = function(stream: boolean)
    {
        appSettings.setBoolean("isStream", stream);
    }

    /**
     * gets whether the media and map is streamed/downloaded.
     * true for stream, false for downloaded. First ever use
     * is true.
     */
    public loadStream()
    {
        return appSettings.getBoolean("isStream", true);
    }
}