import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Enterprise } from "../../shared/enterprise";
import { Participant } from "../../shared/participant";
import { Place } from "../../shared/place";
import { MediaItem } from "../../shared/mediaItem";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { Config } from "./config";

@Injectable()
export class EnterpriseService
{
    constructor(private http: Http) {}

    getEnterprises()
    {
        let enterpriseList = [];
        let headers = new Headers();

        return this.http.get(Config.apiUrl, {
        headers: headers
        })
        .map(res => res.json())
        .map(data =>
        {
            data.forEach((enterprise) =>
            {
                enterpriseList.push(new Enterprise(enterprise.Id, enterprise.Name, 
                /*downloaded:*/false, /*hasPassword:*/enterprise.HasPassword, enterprise.CoverImageURL, null, enterprise.ModifiedUTC));
            });
            return enterpriseList;
        })
        .catch(this.handleErrors);
    }

    getEnterprise(id: Number, password: string){
        
        let headers = new Headers();
        headers.append("Authorization", password);

        return this.http.get(Config.apiUrl + id, {headers: headers})
            .map(res => res.json())
            .map(enterpriseJSON => {
                return Enterprise.EnterpriseFromJSON(enterpriseJSON);
            })
            .catch(this.handleErrors);
    }

    handleErrors(error: Response)
    {
        return Observable.throw(error);
    }
}