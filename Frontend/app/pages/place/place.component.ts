import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDatabaseService } from "../../shared/localDatabaseService";
import { Place } from "../../shared/place";
import { MediaItem } from "../../shared/mediaItem"
import { registerElement } from "nativescript-angular/element-registry";
registerElement("VideoPlayer", () => require("nativescript-videoplayer").Video);
import { TNSPlayer } from "nativescript-audio";
import { Observable } from "tns-core-modules/data/observable";
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
    private audioPlayer: TNSPlayer;

    enterpriseId: number;
    participantId: number;
    placeId: number;
    isDataAvailable: boolean = false;

    testVideo: string = "https://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4";
    
    @ViewChild("videoPlayer") videoPlayer: ElementRef;

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

            this.audioPlayer = new TNSPlayer();
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

    playVideo()
    {
        if (this.selectedMedia.mediaItemType === 2)
        {
            this.videoPlayer.nativeElement.play();
        }
    }

    playAudio()
    {
        // res://Voice001 does not exist
        this.audioPlayer.playFromUrl({
            audioFile: "res://Voice001",
            loop: false
        }).then(() => {
            console.log("playing audio"); // + this.selectedMedia.name);
        });
    }

    stopAudio()
    {
        this.audioPlayer.pause();
    }
}