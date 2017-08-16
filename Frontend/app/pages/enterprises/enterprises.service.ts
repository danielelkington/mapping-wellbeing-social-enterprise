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
            data.forEach((enterprise) =>
            {
                enterpriseList.push(new Enterprise(enterprise.Id, enterprise.Name, 
                /*downloaded:*/false, /*hasPassword:*/enterprise.HasPassword, enterprise.CoverImageURL));
            });
            return enterpriseList;
        })
        .catch(this.handleErrors);
    }

    getEnterprise(id: Number, password: string){
        
        //TODO call service!
        return new Observable<Enterprise>(observer=> {
            observer.next(new Enterprise(1, 'a', true, false, 'a'));
        });
    }

    handleErrors(error: Response)
    {
        return Observable.throw(error);
    }
}