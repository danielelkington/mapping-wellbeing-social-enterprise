import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Participant } from "../enterprises/participants";
import { Observable } from "data/observable";

// Displays a list of enterprises to the user and allows
// them to select one.
@Component({
    selector: "participants",
    templateUrl: "pages/participants/participants.html",
    styleUrls: ["pages/participants/participants-common.css", "pages/participants/participants.css"]
})

export class ParticipantsComponent {

	userIcon: String = "https://i.imgur.com/Qu3yZ9r.png"; 

    // the participants
    participantList: Array<Participant> = [new Participant("Bob"), new Participant("Jack"), new Participant("Andrew"), new Participant("Max"), new Participant("John")];

    constructor(private router: Router) { }

    openMap(){
		this.router.navigate(["/map"]);
    }
}