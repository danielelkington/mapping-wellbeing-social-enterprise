import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDatabaseService } from "../../shared/localDatabaseService";
import { Place } from "../../shared/place";
import { MediaItem } from "../../shared/mediaItem"
import "rxjs/add/operator/switchMap";
import * as application from "application";
import * as repeaterModule from "tns-core-modules/ui/repeater";

// Displays details of a place to the user
@Component({
    selector: "place",
    templateUrl: "pages/place/place.html",
    styleUrls: ["pages/place/place-common.css", "pages/place/place.css"]
})

export class PlaceComponent implements OnInit {
    
    private place: Place;
    private selectedMedia: MediaItem;

    enterpriseId: number;
    participantId: number;
    placeId: number
    isDataAvailable: boolean = false;

    constructor(private router: Router,
		private route: ActivatedRoute,
		private localDatabaseService: LocalDatabaseService)
	{}

    ngOnInit()
    {
        this.route.params.subscribe(params => {
            this.enterpriseId = +params['eId'];
            this.participantId = +params['pId'];
            this.placeId = +params['sId'];

            this.localDatabaseService.getSavedEnterprise(this.enterpriseId).then(enterprise => {
				enterprise.participants.forEach((participant) => {
					if (participant.id == this.participantId)
					{
                        participant.places.forEach((place) => {
                            if (place.id == this.placeId)
                            {
                                this.place = place;
                                this.selectMedia(0);
                                this.isDataAvailable = true;
                            }
                        });
                    }
                });
            });
        });

        /*Buggy attempt at fixing back navigation*/
        //if (application.android)
            //application.android.on(application.AndroidApplication.activityBackPressedEvent, this.goBack);
    }

    goBack() 
    {
        var a = this.router;
        a.navigate(["/map", this.enterpriseId, this.participantId]);
    }

    selectMedia(index)
    {
        this.selectedMedia = this.place.mediaItems[index];
    }
}