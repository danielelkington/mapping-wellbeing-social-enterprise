import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Enterprise} from "./enterprise"
import {Participant} from "./participant";
import {Place} from "./place";
import {MediaItem} from "./mediaItem";
import {SimpleMediaItem} from "./simpleMediaItem";
import {LocalDatabaseService} from "./localDatabaseService";
import {knownFolders, File, Folder, path} from "file-system";
var http = require("http");

@Injectable()
export class LocalStorageService{

    static readonly mediaFolder : Folder = Folder.fromPath(path.join(knownFolders.documents().path, "media"));

    constructor(private localDatabaseService:LocalDatabaseService){
    }

    saveEnterprise(enterpriseWithoutDetail : Enterprise, enterpriseToSave : Enterprise) : Promise<any>{
        var promise = this.localDatabaseService.saveEnterprise(enterpriseToSave);
        
        let mediaItems = enterpriseToSave.getMediaToDownload();
        enterpriseWithoutDetail.totalThingsToDownload = 
            mediaItems.length + enterpriseToSave.participants.length; //media plus a map per participant

        //Download media, updating progress bar after each one
        for(let m of mediaItems){
            (function(mediaItem : SimpleMediaItem){
                if (mediaItem.url != null && mediaItem.filename != null){
                    promise = promise.then(x =>
                    http.getFile(mediaItem.url, path.join(LocalStorageService.mediaFolder.path, mediaItem.filename)))
                    .then(y => enterpriseWithoutDetail.numberDownloaded ++);
                }
            })(m);
        }
        
        //Todo: download mapbox region

        return promise;
    }
}