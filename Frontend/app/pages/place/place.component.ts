import { Component, OnInit, ViewChild, ElementRef, NgZone } from "@angular/core";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import { LocalDatabaseService } from "../../shared/localDatabaseService";
import { LocalStorageService } from "../../shared/localStorageService";
import { Place } from "../../shared/place";
import { MediaItem } from "../../shared/mediaItem"
import { Common } from  "../../shared/common";
import { registerElement } from "nativescript-angular/element-registry";
registerElement("VideoPlayer", () => require("nativescript-videoplayer").Video);
import { TNSPlayer } from "nativescript-audio";
import { Observable } from "tns-core-modules/data/observable";
import "rxjs/add/operator/switchMap";
import { Page } from "tns-core-modules/ui/page";
import * as repeaterModule from "tns-core-modules/ui/repeater";
import * as application from "application";
import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance, clearWatch, Location } from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";

// Displays details of a place to the user
@Component({
    selector: "place",
    templateUrl: "pages/place/place.html",
    styleUrls: ["pages/place/place-common.css", "pages/place/place.css"]
})

export class PlaceComponent implements OnInit {
    
    place: Place;
    private selectedMedia: MediaItem;
    private audioPlayer: TNSPlayer;

    enterpriseId: number;
    participantId: number;
    placeId: number;
    isDataAvailable: boolean = false;
    watchLocationId: number;

    constructor(private router: RouterExtensions,
		private route: PageRoute,
        private localDatabaseService: LocalDatabaseService,
        private localStorageService: LocalStorageService,
        private common: Common,
        private zone: NgZone,
        private page: Page)
	{}

    ngOnInit()
    {
		this.page.on("navigatingFrom", args => {
			if (this.watchLocationId){
				clearWatch(this.watchLocationId);
			}
		});

        this.route.activatedRoute
        .switchMap(activatedRoute => activatedRoute.params)
        .forEach((params) => {
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
                                this.monitorLocation();
                            }
                        });
                    }
                });
            });

            this.audioPlayer = new TNSPlayer();
        });
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

    private monitorLocation(){
        let placeComponent = this;
        if (!isEnabled()){
            return; //location is not enabled
        }
		this.watchLocationId = watchLocation(function (loc){
			if (!loc){
				return;
            }
            let placeLoc = new Location();
            placeLoc.latitude = placeComponent.place.latitude;
            placeLoc.longitude = placeComponent.place.longitude;
            let distanceToPlace = distance(loc, placeLoc);
            if (distanceToPlace <= Common.smallLocationThesholdMeters){
                //We are close to this place
                console.log("We are ", String(distanceToPlace), "m away from ", placeComponent.place.name);
                placeComponent.common.setPlaceIdCameNear(placeComponent.place.id);
            }
            if (distanceToPlace >= Common.bigLocationThresholdMeters
                && placeComponent.common.getPlaceIdCameNear() == placeComponent.place.id){
                    console.log("We are ", String(distanceToPlace), "m away from ", placeComponent.place.name);
                    //We are far from this place and were previously close - get out!
                    placeComponent.router.backToPreviousPage();
                }
		},
		function(e){
			console.log("Error: ", e);
		},
		{
			desiredAccuracy: Accuracy.high,
			minimumUpdateTime: Common.updateLocationTimeMilliseconds,
			maximumAge: Common.maximumAgeOfLocationMilliseconds,
			updateDistance: 5

		});
	}
}