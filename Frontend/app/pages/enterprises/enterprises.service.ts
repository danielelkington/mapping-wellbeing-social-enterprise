import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Enterprise } from "../../shared/enterprise";
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
            setTimeout(function(){}, 2000); //to make sure the busy indicator works - later remove this!
            data.forEach((enterprise) =>
            {
                enterpriseList.push(new Enterprise(enterprise.Id, enterprise.Name, "abcd", enterprise.CoverImageURL));
            });
            return enterpriseList;
        })
        .catch(this.handleErrors);
    }

    handleErrors(error: Response)
    {
        return Observable.throw(error);
    }
}