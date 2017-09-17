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
var application = require("application");
 
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
	
	mapboxAccessToken = SecretConfig.mapboxAccessToken;
	participantName: string;

	private map: Mapbox;

	constructor(private router : RouterExtensions,
		private route: PageRoute,
		private localDatabaseService: LocalDatabaseService,
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
			if (app.ios && this.map){
				this.map.unhide();
			}
		});
		this.page.on("navigatingFrom", args => {
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
						});
					}
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
		})
	}
}