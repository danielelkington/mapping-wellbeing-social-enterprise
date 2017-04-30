import { Component, ElementRef, OnInit, ViewChild, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { Enterprise } from "./enterprise";
import { Participant } from "./participants";
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

    // the participants
    pplParticipantList01: Array<Participant> = [new Participant("Bob"), new Participant("Jack")];
    pplParticipantList02: Array<Participant> = [new Participant("Andrew"), new Participant("Max"), new Participant("John")];

    constructor(private router: Router) { }

    // initiate the enterprise list with values
    ngOnInit() {
        this.eplEnterpises.push(new Enterprise(1, "Swinburne", this.pplParticipantList01, null, "https://i.imgur.com/6rtFgGZ.png"));
        this.eplEnterpises.push(new Enterprise(2, "Lilydale Garden", this.pplParticipantList02, "password", "https://i.imgur.com/SREjEeO.png"));
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
                    this.router.navigate(["/map"]);
                }else{
                    alert("Incorrect Password");
                }
            });
        } else{
            this.router.navigate(["/map"]);
        }
    }

    // change the current page. if the enterprise has a password checks 
    // openEnterprise(strName: string) {
    //     for (var i = 0; i < this.eplEnterpises.length; i++) {
    //          if ((strName == this.eplEnterpises[i].strName)) {
    //             if (this.eplEnterpises[i].hasPassword()) {
    //                 if (this.eplEnterpises[i].strPassword === this.strPasswords[i]) {
    //                     this.router.navigate(["/map"]);
    //                 } // end if this.eplEnterpises[i].strPassword != ""
    //                 else {
    //                     alert("Incorrect Password");
    //                 } // end else
    //             } // end if hasPassword
    //             else {
    //                 this.router.navigate(["/map"]);
    //             } // end else
    //         } // end if strName == this.eplEnterpises[i].strName
    //     } // end for i
    // } // openEnterprise
} // end EnterprisesComponent