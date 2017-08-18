import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Enterprise} from "./enterprise"
import {Participant} from "./participant";
import {Place} from "./place";
import {MediaItem} from "./mediaItem";
import {LocalDatabaseService} from "./localDatabaseService";

@Injectable()
export class LocalStorageService{

    constructor(localDatabaseService:LocalDatabaseService){
    }

    saveEnterprise(
        enterpriseWithoutDetail : Enterprise, 
        enterpriseToSave : Enterprise) : Promise<any>{
            //TODO: this should do the following steps:
            //1. Add the downloaded enterprise to the DB using the local database service
            //2. Download all relevant images and media
            //3. Download relevant map area
            //While it does this it should periodically call progressUpdateCallback to update progress
            return new Promise(function(resolve, reject){
                //Let's cheat and make it look like this is doing something...
                setTimeout(function(){
                    enterpriseWithoutDetail.downloadProgressPercentage = 50;
                    setTimeout(function(){
                        enterpriseWithoutDetail.downloadProgressPercentage = 75;
                        setTimeout(function(){
                            resolve();
                        }, 1000);
                    }, 1000);
                }, 2000);
            });
    }
}