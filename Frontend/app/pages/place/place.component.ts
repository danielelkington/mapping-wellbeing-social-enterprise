import { Component, OnInit, ViewChild, ElementRef, NgZone } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDatabaseService } from "../../shared/localDatabaseService";
import { LocalStorageService } from "../../shared/localStorageService";
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

    constructor(private router: Router,
		private route: ActivatedRoute,
        private localDatabaseService: LocalDatabaseService,
        private localStorageService: LocalStorageService,
        private zone: NgZone)
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
                                this.place.mediaItems.forEach(x => x.mediaPath = this.localStorageService.getImagePath(x.filename, x.url));
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

    playAudio()
    {
        let audioMediaItem = this.selectedMedia;
        audioMediaItem.audioPlaying = true;
        if (audioMediaItem.mediaPath == audioMediaItem.url){
            this.audioPlayer.playFromUrl({
                audioFile: this.selectedMedia.mediaPath, 
                loop: false, 
                completeCallback: ()=>this.zone.run(()=>audioMediaItem.audioPlaying = false)
            });
        }
        else{
            this.audioPlayer.playFromFile({
                audioFile: audioMediaItem.mediaPath, 
                loop: false,
                completeCallback: ()=>this.zone.run(()=>audioMediaItem.audioPlaying = false)
            });
        }
    }

    stopAudio()
    {
        this.audioPlayer.pause();
        this.selectedMedia.audioPlaying = false;
    }
}