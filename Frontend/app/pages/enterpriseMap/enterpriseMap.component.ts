import { Component, OnInit } from "@angular/core";
import { SecretConfig } from "../../secretConfig";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import "rxjs/add/operator/switchMap";
import { LocalStorageService } from "../../shared/localStorageService";
import { LocalDatabaseService } from "../../shared/localDatabaseService";
import { Place } from "../../shared/place";
 
// Displays a map associated with an enterprise to the user and allows
// them to select a place.
@Component({
	selector: "map",
	templateUrl: "pages/enterpriseMap/enterpriseMap.html",
	styleUrls: ["pages/enterpriseMap/enterpriseMap-common.css", "pages/enterpriseMap/enterpriseMap.css"]
})
export class EnterpriseMapComponent implements OnInit
{
	mapboxAccessToken = SecretConfig.mapboxAccessToken;
	enterpriseName: string;

	private map: any

	//Coordinates used for initial map view
	private mapLatitude: Number;
	private mapLongitude: Number;

	constructor(private router : RouterExtensions,
		private route: PageRoute,
		private localDatabaseService: LocalDatabaseService)
	{}
	
	//Stores Places and all their data
	places: Array<Place> = [];
	//Connects Place Id to the Participant Id
	placesParticipant: Map<number, number> = new Map<number, number>();

	enterpriseId: number;

	ngOnInit()
  	{
		this.route.activatedRoute
			.switchMap(activatedRoute => activatedRoute.params)
			.forEach((params) => {
			this.enterpriseId = +params['eId'];

            this.localDatabaseService.getSavedEnterprise(this.enterpriseId).then(enterprise => {
				this.enterpriseName = enterprise.name;
				enterprise.participants.forEach((participant) => {

					participant.places.forEach((place) => {
						this.places.push(place);
						this.placesParticipant[place.id] = participant.id;
					})

					var numOfParticipants = 0;

					if (numOfParticipants < 1)
					{
						var maxNorth = participant.getMaxNorthBound();
						var maxSouth = participant.getMaxSouthBound();
						var maxEast = participant.getMaxEastBound();
						var maxWest = participant.getMaxWestBound();
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
			});
		});
	  }

	onMapReady(args) {
		this.map = args.map;

		this.places.forEach((place) => {
			args.map.addMarkers([
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

	onTap(placeId: number)
	{
		console.log("Tapped " + placeId);
		this.router.navigate(["/place", this.enterpriseId, this.placesParticipant[placeId], placeId]);
	}
}