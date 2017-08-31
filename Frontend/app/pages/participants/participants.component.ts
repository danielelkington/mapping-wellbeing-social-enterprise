import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Participant } from "../../shared/participant";
import { Observable } from "data/observable";
import { Color } from "tns-core-modules/color";
import { ListViewEventData } from "nativescript-telerik-ui/listview";
import { LocalDatabaseService } from"../../shared/localDatabaseService";

// Displays a list of participants to the user and allows
// them to select one.
@Component({
    selector: "participants",
    templateUrl: "pages/participants/participants.html",
    styleUrls: ["pages/participants/participants-common.css", "pages/participants/participants.css"]
})

export class ParticipantsComponent {

    participants: Array<Participant> = [];
    enterpriseId;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private localDatabaseService : LocalDatabaseService) { }

    ngOnInit()
    {      
        this.route.params.subscribe(params => {
            this.enterpriseId = +params['id'];
            this.localDatabaseService.getSavedEnterprise(this.enterpriseId).then(enterprise => this.participants = enterprise.participants);
        });
    }

    onItemLoading(args: ListViewEventData)
    {
        const colours = ["#E5DBE1", "#E2EEE5", "#F7E6E3", "#F8F7F2"];
        args.view.backgroundColor = new Color(colours[args.index % colours.length]);
    }

    selectParticipant(args)
    {
        var participant = this.participants[args.index];
        this.router.navigate(["/map", this.enterpriseId, participant.id]);
    }
}