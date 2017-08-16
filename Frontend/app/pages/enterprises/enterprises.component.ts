import { Component, ElementRef, OnInit, ViewChild, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { Enterprise } from "../../shared/enterprise";
import { TextField } from "ui/text-field";
import { Observable } from "data/observable";
import { EnterpriseService } from "./enterprises.service";
import { Config } from "./config";
import dialogs = require("ui/dialogs");
import timer = require("timer");

// Displays a list of enterprises to the user and allows
// them to select one.
@Component({
    selector: "enterprises",
    providers:  [EnterpriseService],
    templateUrl: "pages/enterprises/enterprises.html",
    styleUrls: ["pages/enterprises/enterprises-common.css", "pages/enterprises/enterprises.css"]
})
export class EnterprisesComponent implements OnInit
{
    // an array of all enterprises
    enterprises: Array<Enterprise> = [];
    isLoading = false;

    constructor(private router: Router, private enterpriseService: EnterpriseService) { }

    // Initialize the enterprise list with values
    ngOnInit()
    {
        ////////////////////////////////////////////////
        //Add code to check for downloaded enterprises//
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
    //Enters the enterprise if password is correct, or no password required
    openEnterprise(args)
    {
        var enterprise = this.enterprises[args.index];
        if (enterprise.hasPassword())
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
                if (enterprise.password === r.text)
                {
                    enterprise.unlock();
                    dialogs.alert("Entering enterprise...");
                }
                else
                {
                    dialogs.alert("Incorrect Password");
                }
            });
        }
        else
        {
            dialogs.alert("Entering enterprise...");
        }
    }

    //Asks user to confirm download before downloading enterprise
    downloadEnterprise(args)
    {
        var enterprise = this.enterprises[args.index];
        if (!enterprise.isDownloaded())
        {
            dialogs.confirm({
                title: "Download " + enterprise.name,
                message: "Are you sure you want to download the enterprise " + enterprise.name + " ?",
                okButtonText: "Yes",
                cancelButtonText: "No"
            })
            .then(result =>
            {
                // result argument is boolean
                if (result)
                    dialogs.alert("Downloading enterprise " + enterprise.name);
                
                var timer1 = timer.setTimeout(() =>
                {
                    dialogs.alert(enterprise.name + " has been downloaded.");
                    enterprise.download();
                }, 5000);
                timer.clearTimeout(timer1);
            });
        }
        else
        {
            dialogs.alert("This enterprise has already been downloaded");
        }
    }
}