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
    templateUrl: "pages/enterprises/enterprises.html",
    styleUrls: ["pages/enterprises/enterprises-common.css", "pages/enterprises/enterprises.css"]
})
export class EnterprisesComponent implements OnInit {

    // an array of all the enterprises
    eplEnterpises: Array<Enterprise> = [];
    strPasswords: Array<string> = [];
    txtPassword = "";
    txfTest: Array<TextField> = [];

    constructor(private router: Router) { }

    // initiate the enterprise list with values
    ngOnInit() {
        this.eplEnterpises.push(new Enterprise(1, "Bluetown Op Shop", null, "https://i.imgur.com/3rdsXvM.png"));
        this.eplEnterpises.push(new Enterprise(2, "Forestedge Community Garden", "abc", "https://i.imgur.com/SREjEeO.png"));
        this.eplEnterpises.push(new Enterprise(3, "The Ethical Cafe", "abc", "https://i.imgur.com/LwYjbVk.png"));
    } // end ngOnInit

    //Request password if required by enterprise. If password correct or no password,
    //changes the page.
    openEnterprise(args){
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
    }
} // end EnterprisesComponent