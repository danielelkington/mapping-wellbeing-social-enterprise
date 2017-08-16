import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Enterprise } from "./enterprise";
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
        headers.append("Authorization", "Bearer " + Config.token);

        return this.http.get(Config.apiUrl, {
        headers: headers
        })
        .map(res => res.json())
        .map(data =>
        {
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