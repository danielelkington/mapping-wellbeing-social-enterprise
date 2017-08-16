import { Component, ElementRef, OnInit, ViewChild, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { Enterprise } from "../../shared/enterprise";
import { TextField } from "ui/text-field";
import { Observable } from "data/observable";
import { EnterpriseService } from "./enterprises.service";
import {LocalStorageService} from"../../shared/localStorageService";
import {LocalDatabaseService} from"../../shared/localDatabaseService";
import { Config } from "./config";
import dialogs = require("ui/dialogs");
import timer = require("timer");

// Displays a list of enterprises to the user and allows
// them to select one.
@Component({
    selector: "enterprises",
    providers:  [EnterpriseService, LocalStorageService, LocalDatabaseService],
    templateUrl: "pages/enterprises/enterprises.html",
    styleUrls: ["pages/enterprises/enterprises-common.css", "pages/enterprises/enterprises.css"]
})
export class EnterprisesComponent implements OnInit
{
    // an array of all enterprises
    enterprises: Array<Enterprise> = [];
    isLoading = false;

    constructor(private router: Router,
        private enterpriseService: EnterpriseService,
        private localStorageService : LocalStorageService) { }

    // Initialize the enterprise list with values
    ngOnInit()
    {
        ////////////////////////////////////////////////
        //Add code to check for downloaded enterprises
        //(note DE: should shove downloaded enterprises in first,
        //and for any that come back from the service we should NOT update any
        //them in the list - ie, keep the hasPassword value false and isDownloaded value true)
        ////////////////////////////////////////////////

        this.isLoading = true;
        this.enterpriseService.getEnterprises()
        .subscribe(loadedEnterprises =>
        {
            loadedEnterprises.forEach((enterprise) =>
            {
                this.enterprises.push(enterprise);
            });
            this.isLoading = false;
            if (this.enterprises.length === 0){

            }
        },
        err =>
        {
            console.log(err);
            dialogs.alert("Failed to load enterprises");
        });
    }

    //Request password if required by enterprise
    //If enterprise already downloaded, enters it
    //If enterprise not downloaded, tries to download it.
    //Enters the enterprise if password is correct, or no password required
    selectEnterprise(args)
    {
        var enterprise = this.enterprises[args.index];
        if (enterprise.busy){
            return;
        }
        if (enterprise.isDownloaded()){
            this.openEnterprise(enterprise);
            return;
        }

        if (enterprise.hasPassword)
        {
            dialogs.prompt({
                title: "Password",
                message: "Enter password to view " + enterprise.name,
                okButtonText: "OK",
                cancelButtonText: "Cancel",
                inputType: dialogs.inputType.password
            })
            .then(r => {
                if (!r.result)
                {
                    return;
                }
                this.downloadEnterprise(enterprise, r.text);
            });
        }
        else
        {
            this.downloadEnterprise(enterprise, null);
        }
    }

    openEnterprise(enterprise){
        //TODO
        dialogs.alert("Entering enterprise...");
    }

    //Asks user to confirm download before downloading enterprise
    downloadEnterprise(enterprise, password)
    {
        dialogs.confirm({
            title: "Download " + enterprise.name,
            message: "Are you sure you want to download the enterprise " + enterprise.name + " ?",
            okButtonText: "Yes",
            cancelButtonText: "No"
        })
        .then(result =>
        {
            if (!result)
                return;
            enterprise.busy = true;

            this.enterpriseService.getEnterprise(enterprise, password)
            .subscribe(downloadedEnterprise =>
            {
                this.localStorageService.saveEnterprise(enterprise, downloadedEnterprise)
                    .then(x => {
                        enterprise.busy = false;
                        enterprise.setDownloaded();
                    });
            },
            err =>
            {
                console.log(err);
                dialogs.alert("Failed to download enterprise");
                enterprise.busy = false;
            });
            
            
        });
    }
}