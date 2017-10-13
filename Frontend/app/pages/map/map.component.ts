import { Component, OnInit } from "@angular/core";
import { SecretConfig } from "../../secretConfig";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import "rxjs/add/operator/switchMap";
import { LocalStorageService } from "../../shared/localStorageService";
import { LocalDatabaseService } from "../../shared/localDatabaseService";
import { Place } from "../../shared/place";
import { PathPoint } from "../../shared/pathPoint";
import { Common } from  "../../shared/common";
import { Page } from "tns-core-modules/ui/page";
import {Mapbox, MapStyle, MapboxView} from "nativescript-mapbox";
import * as app from "tns-core-modules/application";
import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance, clearWatch, Location } from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
var application = require("application");
import * as timer from "timer";
 
// Displays a map associated with an enterprise to the user and allows
// them to select a place.
@Component({
	selector: "map",
	templateUrl: "pages/map/map.html",
	styleUrls: ["pages/map/map-common.css", "pages/map/map.css"]
})
export class MapComponent implements OnInit
{
	//Extra bit of map around all places, in degrees
	private static readonly mapBoundaryDegrees : number = 0.0001;	
	
	private mapboxAccessToken = SecretConfig.mapboxAccessToken;
	participantName: string;
	watchLocationId: number;

	private map: Mapbox;

	constructor(private router : RouterExtensions,
		private route: PageRoute,
		private localDatabaseService: LocalDatabaseService,
		private localStorageService: LocalStorageService,
		private common: Common,
		private page: Page)
	{}

	places: Array<Place>;
	pathPoints: Array<PathPoint>;

	enterpriseId: number;
	participantId: number;

	ngOnInit()
  	{
		//A note on map caching: with iOS caching between pages for maps works.
		//for android it does not. Hence for android we are forced to destroy the
		//map when navigating away from the page, and recreate it when we come back.
		this.page.on("navigatingTo", x => {
			if (app.ios && this.map && x.isBackNavigation){
				this.map.unhide();
				let mapComponent = this;
				if (this.localStorageService.loadAutoOpenPlace()){
					timer.setTimeout(()=>mapComponent.setupAutoPlaceOpen(), 1000);
				}
			}
		});
		this.page.on("navigatingFrom", args => {
			if (this.watchLocationId){
				console.log("Clearing watch");
				clearWatch(this.watchLocationId);
			}
			if (args.isBackNavigation){
				this.common.setPlaceIdCameNear(null);
			}
			if(!this.map)
				return;
			if (args.isBackNavigation || app.android){
				this.map.destroy();
			}
			else{
				this.map.hide();
			}
		});

		this.route.activatedRoute
			.switchMap(activatedRoute => activatedRoute.params)
			.forEach((params) => {
			this.enterpriseId = +params['eId'];
            this.participantId = +params['pId'];

			enableLocationRequest(false).then(x =>{
				this.localDatabaseService.getSavedEnterprise(this.enterpriseId).then(enterprise => {
					enterprise.participants.forEach((participant) => {
						if (participant.id == this.participantId)
						{
							this.places = participant.places;
							this.participantName = participant.name;
							this.pathPoints = participant.pathPoints;
	
							let mapLatitude = (participant.getMaxNorthBound() + participant.getMaxSouthBound())/2;
							let mapLongitude = (participant.getMaxWestBound() + participant.getMaxEastBound())/2;
	
							if (app.ios && this.map)
								return; //ios is smart enough to cache the map so we can show it again
							this.map = new Mapbox();
							timer.setTimeout(()=>{
								this.showMap(mapLatitude, mapLongitude)
								.then(x => {
									this.map.setViewport({
										bounds: {
											north: participant.getMaxNorthBound() + MapComponent.mapBoundaryDegrees,
											east: participant.getMaxEastBound() + MapComponent.mapBoundaryDegrees,
											south: participant.getMaxSouthBound() - MapComponent.mapBoundaryDegrees,
											west: participant.getMaxWestBound() - MapComponent.mapBoundaryDegrees
										}
									});
									this.drawMarkers();
									this.drawLines();
									this.setupAutoPlaceOpen();
								});
								//why should Android users have to wait half a second for their map?
								//don't know. But if you don't make them wait it won't work half the time...
							}, app.android ? 500 : 0);
						}
					});
				});
			});
		});
	  }

	onTap(placeId: number){	
		this.router.navigate(["/place", this.enterpriseId, this.participantId, placeId]);
	}

	private drawMarkers(){
		this.places.forEach((place) => {
			this.map.addMarkers([{
				lat: place.latitude,
				lng: place.longitude,
				id: place.id,
				title: place.name,
				subtitle: "tap for details",
				icon: 'res://ic_map_marker_' + place.sequenceNumber,
				onCalloutTap: (marker) => { 
					this.onTap(marker.id);
				}
			}]);
		});
	}

	private drawLines(){
		if (this.pathPoints.length <= 0)
			return;

		var coordinates = [];

		this.pathPoints.forEach((points) => {
			coordinates.push({'lat': points.latitude, 'lng': points.longitude});
		});

		this.map.addPolyline({
			color: '#ff0000',
			points: coordinates
		});
	}

	private showMap(mapLatitude: number, mapLongitude: number):Promise<any>{
		return this.map.show({
			accessToken: SecretConfig.mapboxAccessToken,
			style: MapStyle.EMERALD,
			margins: {
				top: this.common.getActionBarHeight()
			},
			center: {lat: mapLatitude, lng: mapLongitude},
			zoomLevel: 16,
			showUserLocation: true,
			hideAttribution: true,
			hideLogo: true
		});
	}

	//If location is enabled, every *interval* get current location
	//and compare it to distance between all map locations.
	//If distance is less than smallThreshold, open place.
	private setupAutoPlaceOpen(){
		if (isEnabled() && this.localStorageService.loadAutoOpenPlace()){
			this.monitorLocation();
		}

		if (this.localStorageService.getFakeOpenPlace() && this.places.length >= 2){
			let mapComponent = this;
			let placeIdToOpen = this.places[1].id;
			timer.setTimeout(()=>mapComponent.onTap(placeIdToOpen), this.localStorageService.getSecondsToWait() * 1000);
		}
	}

	private monitorLocation(){
		let mapComponent = this;
		this.watchLocationId = watchLocation(function (loc){
			if (!loc){
				return;
			}
			//Compare location to all other place locations
			for(let place of mapComponent.places){
				let placeLoc = new Location();
				placeLoc.latitude = place.latitude;		
				placeLoc.longitude = place.longitude;
				let distanceToPlace = distance(loc, placeLoc);									
				//console.log(String(distanceToPlace), "m away from ", place.name);
				if (distanceToPlace <= Common.smallLocationThesholdMeters
					&& mapComponent.common.getPlaceIdCameNear() != place.id){
					console.log("We are ", String(distanceToPlace), "m away from ", place.name);
					//We are very close to this place!
					mapComponent.common.setPlaceIdCameNear(place.id);
				 	mapComponent.onTap(place.id);
					return;
				}
				if (distanceToPlace >= Common.bigLocationThresholdMeters
					&& mapComponent.common.getPlaceIdCameNear() == place.id){
						console.log("We are ", String(distanceToPlace), "m away from ", place.name);
						//We are no longer close to a place we were near before.
						mapComponent.common.setPlaceIdCameNear(null);
					}
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