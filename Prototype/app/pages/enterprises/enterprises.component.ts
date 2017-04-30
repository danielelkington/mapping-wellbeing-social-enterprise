import { Component, ElementRef, OnInit, ViewChild, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { Enterprise } from "./enterprise";
import { Participant } from "./participants";
import { TextField } from "ui/text-field";
import { Observable } from "data/observable";

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
        this.eplEnterpises.push(new Enterprise(1, "Enterprise 01", this.pplParticipantList01, "", false));
        this.eplEnterpises.push(new Enterprise(2, "Enterprise 02", this.pplParticipantList02, "Password", true));
    } // end ngOnInit

    // gets the password that a user has entered. Each time the user types a letter it is added
    // into an array at the index of the enterprise id minus 1
    addPassword(numID: number, event: any) {
        let numIndex = numID - 1;
        this.strPasswords[numIndex] = event.value;
        
        console.log("Password: " + this.strPasswords[numIndex] + "\nID: " + numIndex);
        console.log("Password: " + event.value + "\nText Box: " + event.object.id);
    } // end o0nPassword

    // change the current page. if the enterprise has a password checks 
    openEnterprise(strName: string) {
        for (var i = 0; i < this.eplEnterpises.length; i++) {
             if ((strName == this.eplEnterpises[i].strName)) {
                if (this.eplEnterpises[i].hasPassword()) {
                    if (this.eplEnterpises[i].strPassword === this.strPasswords[i]) {
                        this.router.navigate(["/map"]);
                    } // end if this.eplEnterpises[i].strPassword != ""
                    else {
                        alert("Incorrect Password");
                    } // end else
                } // end if hasPassword
                else {
                    this.router.navigate(["/map"]);
                } // end else
            } // end if strName == this.eplEnterpises[i].strName
        } // end for i
    } // openEnterprise
} // end EnterprisesComponent