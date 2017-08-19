import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Enterprise} from "./enterprise"
import {Participant} from "./participant";
import {Place} from "./place";
import {MediaItem} from "./mediaItem";
import {LocalDatabaseService} from "./localDatabaseService";

@Injectable()
export class LocalStorageService{

    constructor(private localDatabaseService:LocalDatabaseService){
    }

    saveEnterprise(enterpriseWithoutDetail : Enterprise, enterpriseToSave : Enterprise) : Promise<any>{
        console.log("here...");
        var promise = this.localDatabaseService.saveEnterprise(enterpriseToSave);
        promise = promise.then(x => {
            console.log("here2");
            //enterpriseWithoutDetail.downloadProgressPercentage = (1.0/enterpriseWithoutDetail.numberOfThingsToDownload());
        });
        return promise;
    }
}