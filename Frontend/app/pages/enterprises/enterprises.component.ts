import { Component, ElementRef, OnInit, ViewChild, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { Enterprise } from "../../shared/enterprise";
import { TextField } from "ui/text-field";
import { Observable } from "data/observable";
import { EnterpriseService } from "./enterprises.service";
import { LocalStorageService } from"../../shared/localStorageService";
import { LocalDatabaseService } from"../../shared/localDatabaseService";
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
        private localStorageService : LocalStorageService,
        private localDatabaseService : LocalDatabaseService) { }

    // Initialize the enterprise list with values
    ngOnInit()
    {
        this.refresh();
    }

    //Request password if required by enterprise
    //If enterprise already downloaded, enters it
    //If enterprise not downloaded, tries to download it.
    //Enters the enterprise if password is correct, or no password required
    selectEnterprise(args)
    {
        var enterprise = this.enterprises[args.index];
        if (enterprise.busy)
        {
            return;
        }

        if (enterprise.isDownloaded())
        {
            this.openEnterprise(enterprise);
            return;
        }

        if (enterprise.hasPassword)
        {
            dialogs.prompt({
                title: "Password",
                message: "Enter password to download " + enterprise.name,
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
                this.downloadEnterprise(enterprise, null);
            });
        }
    }

    openEnterprise(enterprise)
    {
        //TODO
        dialogs.alert("Entering enterprise...");
    }

    downloadEnterprise(enterprise, password)
    {
        enterprise.busy = true;

        this.enterpriseService.getEnterprise(enterprise.id, password)
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
            if (err.status == 403){
                dialogs.alert({title: "Password incorrect", message: "Please check the password and try again", okButtonText: "OK"});
            }
            else{
                console.log(JSON.stringify(err));
                dialogs.alert({title: "Failed to download enterprise", message: "Please try again later"});
            }
            enterprise.busy = false;
        });
    }

    // refreshes the current page
    refresh()
    {
        if (this.isLoading)
            return;
        //Not yet tested//
        //this.localDatabaseService.getSavedEnterprises()
        //.then(x => this.enterprises);
        this.enterprises = [];
        //Hard-coded dummy enterprise in place of enterprises from local database.
        this.enterprises.push(new Enterprise(9, "Test", true, false, "https://i.imgur.com/7gX1F3d.png", "test.png", 1));

        //Keep track of enterprises that have been downloaded
        var downloadedEnterprisesId: Array<number> = [];
        this.enterprises.forEach((enterprise) =>
        {
            downloadedEnterprisesId.push(enterprise.id);
        })
        
        //Load Enterprises from database
        this.isLoading = true;
        this.enterpriseService.getEnterprises()
        .subscribe(loadedEnterprises =>
        {
            loadedEnterprises.forEach((enterprise) =>
            {
                //Only retrieve enterprises that have not been downloaded
                if (downloadedEnterprisesId.indexOf(enterprise.id) < 0)
                    this.enterprises.push(enterprise);
            });
            this.isLoading = false;
        },
        err =>
        {
            console.log(err);
            this.isLoading = false;
            dialogs.alert("Failed to load enterprises");
        });
    }

}