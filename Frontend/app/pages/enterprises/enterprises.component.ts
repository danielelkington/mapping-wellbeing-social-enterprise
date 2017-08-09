import { Component, ElementRef, OnInit, ViewChild, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { Enterprise } from "./enterprise";
import { TextField } from "ui/text-field";
import { Observable } from "data/observable";
import dialogs = require("ui/dialogs");

// Displays a list of enterprises to the user and allows
// them to select one.
@Component({
    selector: "enterprises",
    templateUrl: "/pages/enterprises/enterprises.html",
    styleUrls: ["pages/enterprises/enterprises-common.css"]
})
export class EnterprisesComponent implements OnInit
{

    // an array of all enterprises
    enterprises: Array<Enterprise> = [];

    constructor(private router: Router) { }

    // Initialize the enterprise list with values
    ngOnInit()
    {
        this.enterprises.push(new Enterprise(1, "Swinburne", null, false, "https://i.imgur.com/6rtFgGZ.png"));
        this.enterprises.push(new Enterprise(2, "Lilydale Garden", "abc", true, "https://i.imgur.com/SREjEeO.png"));
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
            });
        }
        else
        {
            dialogs.alert("This enterprise has already been downloaded");
        }
    }

    //Request password if required by enterprise. If password correct or no password,
    //changes the page.
    /*openEnterprise(args){
        var enterprise = this.eplEnterpises[args.index];
        if (enterprise.hasPassword()){
            dialogs.prompt({
                title: "Password",
                message: "Enter password to view " + enterprise.strName,
                okButtonText: "OK",
                cancelButtonText: "Cancel",
                inputType: dialogs.inputType.password
            }).then(r => {
                if (!r.result){
                    return;
                }
                if (enterprise.strPassword === r.text){
                    this.router.navigate(["/participants"]);
                }else{
                    alert("Incorrect Password");
                }
            });
        } else{
            this.router.navigate(["/participants"]);
        }
    }*/
} // end EnterprisesComponent