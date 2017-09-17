import { Component, OnInit } from "@angular/core";
import { SecretConfig } from "../../secretConfig";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import "rxjs/add/operator/switchMap";
import { LocalStorageService } from "../../shared/localStorageService";
import { LocalDatabaseService } from "../../shared/localDatabaseService";
import { Place } from "../../shared/place";
import { Common } from  "../../shared/common";
import { Page } from "tns-core-modules/ui/page";
import { Mapbox, MapStyle, MapboxView } from "nativescript-mapbox";
import * as app from "tns-core-modules/application";
 
// Displays a map associated with an enterprise to the user and allows
// them to select a place.
@Component({
	selector: "map",
	templateUrl: "pages/enterpriseMap/enterpriseMap.html",
	styleUrls: ["pages/enterpriseMap/enterpriseMap-common.css", "pages/enterpriseMap/enterpriseMap.css"]
})
export class EnterpriseMapComponent implements OnInit
{
	//Extra bit of map around all places, in degrees
	private static readonly mapBoundaryDegrees : number = 0.0001;

	mapboxAccessToken = SecretConfig.mapboxAccessToken;
	enterpriseName: string;

	private map: Mapbox;

	//Coordinates used for initial map view
	private mapLatitude: number;
	private mapLongitude: number;

	constructor(private router : RouterExtensions,
		private route: PageRoute,
		private localDatabaseService: LocalDatabaseService,
		private common: Common,
		private page: Page)
	{}
	
	//Stores Places and all their data
	places: Array<Place> = [];

	//Connects Place Id to the Participant Id
	placesParticipant: Map<number, number> = new Map<number, number>();

	enterpriseId: number;

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

            this.localDatabaseService.getSavedEnterprise(this.enterpriseId).then(enterprise => {
				this.enterpriseName = enterprise.name;

				var maxNorth: number;
				var maxSouth: number;
				var maxEast: number;
				var maxWest: number;

				var numOfParticipants = 0;

				enterprise.participants.forEach((participant) => {

					participant.places.forEach((place) => {
						this.places.push(place);
						this.placesParticipant[place.id] = participant.id;
					})

					if (numOfParticipants < 1)
					{
						maxNorth = participant.getMaxNorthBound();
						maxSouth = participant.getMaxSouthBound();
						maxEast = participant.getMaxEastBound();
						maxWest = participant.getMaxWestBound();
					}
					else
					{
						if (participant.getMaxNorthBound() > maxNorth)
							maxNorth = participant.getMaxNorthBound();
						if (participant.getMaxSouthBound() < maxSouth)
							maxSouth = participant.getMaxSouthBound();
						if (participant.getMaxWestBound() < maxWest)
							maxWest = participant.getMaxWestBound();
						if (participant.getMaxEastBound() > maxEast)
							maxEast = participant.getMaxEastBound();
					}

					this.mapLatitude = (maxNorth + maxSouth)/2;
					this.mapLongitude = (maxWest + maxEast)/2;

					numOfParticipants++;
				});

				if (app.ios && this.map)
					return; //ios is smart enough to cache the map so we can show it again
				
				this.map = new Mapbox();
				this.showMap(this.mapLatitude, this.mapLongitude)
				.then(x => {
					this.map.setViewport({
						bounds: {
							north: maxNorth + EnterpriseMapComponent.mapBoundaryDegrees,
							east: maxEast + EnterpriseMapComponent.mapBoundaryDegrees,
							south: maxSouth - EnterpriseMapComponent.mapBoundaryDegrees,
							west: maxWest - EnterpriseMapComponent.mapBoundaryDegrees
						}
					});
					this.drawMarkers();
				});
			});
		});
	}

	drawMarkers() {
		this.places.forEach((place) => {
			this.map.addMarkers([
				{
					lat: place.latitude,
					lng: place.longitude,
					id: place.id,
					title: place.name,
					subtitle: "tap for details",
					icon: 'res://ic_coloured_marker_' + (((this.placesParticipant[place.id] * 3 - 3) % 13) + 1),
					onCalloutTap: (marker) => { this.onTap(marker.id); }
				}
			])
		});
	}

	private showMap(mapLatitude: number, mapLongitude: number):Promise<any>
	{
		return this.map.show({
			accessToken: SecretConfig.mapboxAccessToken,
			style: MapStyle.EMERALD,
			margins:
			{
				top: this.common.getActionBarHeight()
			},
			center: {lat: mapLatitude, lng: mapLongitude},
			zoomLevel: 12.5,
			showUserLocation: false,
			hideAttribution: true,
			hideLogo: true
		})
	}

	onTap(placeId: number)
	{
		this.router.navigate(["/place", this.enterpriseId, this.placesParticipant[placeId], placeId]);
	}
}