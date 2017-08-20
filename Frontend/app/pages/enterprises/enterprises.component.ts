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

    openEnterprise(enterprise)
    {
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
        this.enterprises.push(new Enterprise(9, "Test", true, false, "https://i.imgur.com/7gX1F3d.png"));

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
    
    //Pull to Refresh
    public onPullToRefreshInitiated(args: ListViewEventData) {
            this.refresh();
            var listView = args.object;
            listView.notifyPullToRefreshFinished();
    }

    //Swipe to delete
    public onSwipeCellStarted(args: SwipeActionsEventData) {

        var swipeLimits = args.data.swipeLimits;

        swipeLimits.threshold = 50 * utilsModule.layout.getDisplayDensity();
        swipeLimits.left = 0;
        
        var test = false;   //replace with isDownloaded when implemented
       
        if (test) {
            swipeLimits.right = 0;
        } else {
            swipeLimits.right = 60 * utilsModule.layout.getDisplayDensity();
        }
    }

    public onItemClick(args: ListViewEventData) {
        var listView = <RadListView>frameModule.topmost().currentPage.getViewById("listView");
        listView.notifySwipeToExecuteFinished();
    }

    public onRightSwipeClick(args: SwipeActionsEventData) {
        var tappedItemData = args.object.bindingContext;
        console.log("Item index: " + tappedItemData.id);

        var index = this.enterprises.findIndex(x => x.id === tappedItemData.id) //Delete enterprise data - need to keep enterprise in list but have it greyed-out
        this.enterprises.splice(index, 1);

        var listView = <RadListView>frameModule.topmost().currentPage.getViewById("listView");
        listView.notifySwipeToExecuteFinished();
    }
}