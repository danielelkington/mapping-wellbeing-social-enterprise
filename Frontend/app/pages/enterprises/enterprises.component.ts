import { Component, ElementRef, OnInit, ViewChild, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { Enterprise } from "../../shared/enterprise";
import { TextField } from "ui/text-field";
import { ItemEventData } from "ui/list-view";
import { Observable, EventData } from "data/observable";
import { EnterpriseService } from "./enterprises.service";
import { LocalStorageService } from"../../shared/localStorageService";
import { LocalDatabaseService } from"../../shared/localDatabaseService";
import { Config } from "./config";
import { View } from "tns-core-modules/ui/core/view";
import { ListViewEventData, RadListView, SwipeActionsEventData } from "nativescript-telerik-ui/listview";
import dialogs = require("ui/dialogs");
import timer = require("timer");

import * as frameModule from "tns-core-modules/ui/frame";
import * as utilsModule from "tns-core-modules/utils/utils";
import * as app from "tns-core-modules/application";

import * as colorModule from "tns-core-modules/color";
var Color = colorModule.Color;

// Displays a list of enterprises to the user and allows
// them to select one.
@Component({
    selector: "enterprises",
    providers:  [EnterpriseService, LocalStorageService],
    templateUrl: "pages/enterprises/enterprises.html",
    styleUrls: ["pages/enterprises/enterprises-common.css", "pages/enterprises/enterprises.css"]
})
export class EnterprisesComponent implements OnInit
{
    // An array of all enterprises
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

    // Request password if required by enterprise
    // If enterprise already downloaded, enters it
    // If enterprise not downloaded, tries to download it.
    // Enters the enterprise if password is correct, or no password required
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
        this.router.navigate(["/participants", enterprise.id]);
    }
    
    // Saves the selected enterprise to the device
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
    refresh() : Promise<any>
    {
        if (this.isLoading)
            return Promise.resolve(0);
        //Keep track of enterprises that have been downloaded
        var downloadedEnterprisesId: Array<number> = [];
        this.isLoading = true;

        var promise = this.localDatabaseService.initialiseDatabaseIfNotExists()
        .then(x => this.localDatabaseService.getSavedEnterprises())
        .then(result => {
            this.enterprises = result;
            this.enterprises.forEach((enterprise) =>
            {
                downloadedEnterprisesId.push(enterprise.id);
            })
        });
        promise = promise.then(x => this.enterpriseService.getEnterprises().toPromise());
        promise = promise.then(loadedEnterprises => {
            loadedEnterprises.forEach((enterprise) =>
                {
                    //Only retrieve enterprises that have not been downloaded
                    if (downloadedEnterprisesId.indexOf(enterprise.id) < 0)
                        this.enterprises.push(enterprise);
                });
                this.isLoading = false;
        });
        promise.catch(err => {
            console.log(err);
            this.isLoading = false;
            dialogs.alert("Failed to load enterprises");
        });
        return promise;
    }
    
    //Pull to Refresh
    public onPullToRefreshInitiated(args: ListViewEventData) {
        var listView = args.object;    
        this.refresh()
            .then(x => {
                if (app.ios){
                    listView.notifyPullToRefreshFinished();
                }
            });
        if (app.android){
            //Android seems to have issues recognising this if we put it in the 'then' of a promise.
            //We'll put it here and rely on the other busy indicator.
            listView.notifyPullToRefreshFinished();
        }
    }

    //Swipe to delete
    public onSwipeCellStarted(args: SwipeActionsEventData) {
        var swipeLimits = args.data.swipeLimits;

        swipeLimits.threshold = 50 * utilsModule.layout.getDisplayDensity();
        swipeLimits.left = 0;
        
        var enterprise = this.enterprises[args.index];
        if (enterprise.isDownloaded()){
            swipeLimits.right = utilsModule.layout.toDevicePixels(60);
        }
        else{
            swipeLimits.right = 0;
        }
    }

    public onItemClick(args: ListViewEventData) {
        var listView = <RadListView>frameModule.topmost().currentPage.getViewById("listView");
        listView.notifySwipeToExecuteFinished();
    }

    public onRightSwipeClick(args: SwipeActionsEventData) {
        if (this.isLoading)
            return;
        var tappedItemData = args.object.bindingContext;
        var listView = <RadListView>frameModule.topmost().currentPage.getViewById("listView");

        var index = this.enterprises.findIndex(x => x.id === tappedItemData.id)
        var enterprise = this.enterprises[index];
        //Delete enterprise data - need to keep enterprise in list but have it greyed-out
        this.isLoading = true;
        this.localStorageService.deleteEnterprise(enterprise)
            .then(x => {
                listView.notifySwipeToExecuteFinished();
                this.isLoading = false;
                this.refresh();
            })
            .catch(x => {
                this.isLoading = false;
            });
    }

    public onItemLoading(args: ListViewEventData) {
        const colours = ["#E5DBE1", "#E2EEE5", "#F7E6E3", "#F8F7F2"];
        
        args.view.backgroundColor = new Color(colours[args.index % colours.length]);
    }
}
