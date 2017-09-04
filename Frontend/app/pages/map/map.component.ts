import { Component, OnInit } from "@angular/core";
import { SecretConfig } from "../../secretConfig";
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import "rxjs/add/operator/switchMap";
import { LocalStorageService } from "../../shared/localStorageService";
import { LocalDatabaseService } from "../../shared/localDatabaseService";
import { Place } from "../../shared/place";
import { PathPoint } from "../../shared/pathPoint";
 
// Displays a map associated with an enterprise to the user and allows
// them to select a place.
@Component({
	selector: "map",
	templateUrl: "pages/map/map.html",
	styleUrls: ["pages/map/map-common.css", "pages/map/map.css"]
})
export class MapComponent implements OnInit
{
	mapboxAccessToken = SecretConfig.mapboxAccessToken;
	participantName: string;

	private map: any

	//Coordinates used for initial map view
	private mapLatitude: Number;
	private mapLongitude: Number;

	constructor(private router : RouterExtensions,
		private route: PageRoute,
		private localDatabaseService: LocalDatabaseService)
	{}

	places: Array<Place>;
	pathPoints: Array<PathPoint>;

	enterpriseId: number;
	participantId: number;

	ngOnInit()
  	{
		this.route.activatedRoute
			.switchMap(activatedRoute => activatedRoute.params)
			.forEach((params) => {
			let enterpriseId = +params['eId'];
            let participantId = +params['pId'];

            this.localDatabaseService.getSavedEnterprise(this.enterpriseId).then(enterprise => {
				enterprise.participants.forEach((participant) => {
					if (participant.id == this.participantId)
					{
						this.places = participant.places;
						this.participantName = participant.name;
						this.pathPoints = participant.pathPoints;

						this.mapLatitude = (participant.getMaxNorthBound() + participant.getMaxSouthBound())/2;
						this.mapLongitude = (participant.getMaxWestBound() + participant.getMaxEastBound())/2;
					}
				});
			});
		});
	  }

	onMapReady(args) {
		this.map = args.map;

		if (this.pathPoints && this.pathPoints.length > 0){
			this.drawLines();
		}

		this.places.forEach((place) => {
			args.map.addMarkers([
				{
					lat: place.latitude,
					lng: place.longitude,
					id: place.id,
					title: place.name,
					subtitle: "tap for details",
					icon: 'res://ic_map_marker_' + place.sequenceNumber,
					onCalloutTap: (marker) => { this.onTap(marker.id); }
				}
			])
		});
	}

	onTap(placeId: number)
	{	
		this.router.navigate(["/place", this.enterpriseId, this.participantId, placeId]);
	}

	drawLines()
	{
		var coordinates = [];

		this.pathPoints.forEach((points) => {
			coordinates.push({'lat': points.latitude, 'lng': points.longitude});
		});

		this.map.addPolyline({
			color: '#ff0000',
			points: coordinates
		});
	}
}