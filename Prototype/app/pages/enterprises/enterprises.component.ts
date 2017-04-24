import { Component } from "@angular/core";
import { Router } from "@angular/router";

// Displays a list of enterprises to the user and allows
// them to select one.
@Component({
    selector: "enterprises",
    templateUrl: "pages/enterprises/enterprises.html",
    styleUrls: ["pages/enterprises/enterprises-common.css", "pages/enterprises/enterprises.css"]
})
export class EnterprisesComponent{

    constructor(private router: Router){}

    openEnterprise(){
        this.router.navigate(["/map"])
    }
}