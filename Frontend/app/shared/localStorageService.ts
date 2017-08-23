import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Enterprise} from "./enterprise"
import {Participant} from "./participant";
import {Place} from "./place";
import {MediaItem} from "./mediaItem";
import {SimpleMediaItem} from "./simpleMediaItem";
import {LocalDatabaseService} from "./localDatabaseService";
import {knownFolders, File, Folder, path} from "file-system";
import {Mapbox, MapStyle} from "nativescript-mapbox";
import {SecretConfig} from "../secretConfig";
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
            console.log("mediaFolder: ", LocalStorageService.mediaFolder.path);
            var filePath = path.join(LocalStorageService.mediaFolder.path, filename);
            if (File.exists(filePath)){
                console.log("Image path is ", path);
                return filePath;
            }
        }
        return url;
    }

    saveEnterprise(enterpriseWithoutDetail : Enterprise, enterpriseToSave : Enterprise) : Promise<any>{
        //Empty promise makes chaining easier.
        var promise : Promise<any> = Promise.resolve(0);

        let mediaItems = enterpriseToSave.getMediaToDownload();
        enterpriseWithoutDetail.totalThingsToDownload = 
            mediaItems.length + enterpriseToSave.participants.length; //media plus a map per participant

        //Download media, updating progress bar after each one
        for(let m of mediaItems){
            (function(mediaItem : SimpleMediaItem){
                if (mediaItem.url && mediaItem.filename){
                    promise = promise.then(x =>
                    http.getFile(mediaItem.url, path.join(LocalStorageService.mediaFolder.path, mediaItem.filename)))
                    .then(y => enterpriseWithoutDetail.numberDownloaded ++);
                }
            })(m);
        }
        
        promise = this.downloadMaps(enterpriseToSave, promise);
        promise = promise.then(x => console.log("Looks like downloading worked!"));

        //Save to local DB last, because this is harder to recover from
        //TODO: think of how to make all this more ACID. :)
        promise = promise.then(x => this.localDatabaseService.saveEnterprise(enterpriseToSave));

        promise.catch(err => {
            console.log("Error: ", JSON.stringify(err));
            return Observable.throw(err);
        });

        return promise;
    }

    private downloadMaps(enterpriseToSave: Enterprise, promise: Promise<any>) : Promise<any>
    {
        //Download mapbox region
        var mapbox = new Mapbox();

        //Yeah, so there are bugs with Mapbox that will stop this working out of the mapbox (haha).
        //I've submitted a pull request, but in the meantime you need to do this! Soz :(
        //To get mapbox to work: after installing node packages, in mapbox.android.js add the following starting at line 767
        // if (!_accessToken){
        //     _accessToken = options.accessToken;
        // }
        // com.mapbox.mapboxsdk.Mapbox.getInstance(application.android.context, _accessToken);

        //And in mapbox.ios.js, add the folloing starting at line 507
        // if (options.accessToken){
        //     MGLAccountManager.setAccessToken(options.accessToken);
        // }
        
        for(let p of enterpriseToSave.participants){
            (function(participant : Participant){
                if (participant.places.length > 0){
                    promise = promise.then(x =>{
                        console.log("About to download a region...");
                        return mapbox.downloadOfflineRegion({
                            accessToken: SecretConfig.mapboxAccessToken,
                            name: "E" + enterpriseToSave.id + "P" + participant.id,
                            style: MapStyle.EMERALD,
                            minZoom: 15,
                            maxZoom: 16,
                            bounds : {
                                north : participant.getMaxNorthBound() + LocalStorageService.mapBoundaryDegrees,
                                east : participant.getMaxEastBound() + LocalStorageService.mapBoundaryDegrees,
                                south : participant.getMaxSouthBound() - LocalStorageService.mapBoundaryDegrees,
                                west: participant.getMaxWestBound() - LocalStorageService.mapBoundaryDegrees
                            },
                            onProgress: function (progress) {
                                //Weird things seem to happen if you leave this out...
                            }
                        });
                    });
                }
            })(p);
        }
        return promise;
    }
}