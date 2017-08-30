import { Component, OnInit } from "@angular/core";
import { SecretConfig } from "../../secretConfig";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
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

	private map: any

	//Coordinates used for initial map view
	private mapLatitude: Number;
	private mapLongitude: Number;

	constructor(private router : Router,
		private route: ActivatedRoute,
		private localDatabaseService: LocalDatabaseService)
	{}

	places: Array<Place>;
	pathPoints: Array<PathPoint>;

	ngOnInit()
  	{
		this.route.params.subscribe(params => {
			let enterpriseId = +params['eId'];
            let participantId = +params['pId'];

            this.localDatabaseService.getSavedEnterprise(enterpriseId).then(enterprise => {
				enterprise.participants.forEach((participant) => {
					if (participant.id == participantId)
					{
						this.places = participant.places;

						this.mapLatitude = (participant.getMaxNorthBound() + participant.getMaxSouthBound())/2;
						this.mapLongitude = (participant.getMaxWestBound() + participant.getMaxEastBound())/2;
					}
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
					subtitle: place.description,
					icon: 'res://ic_map_marker_' + place.id,
					onCalloutTap: (marker) => { this.onTap(marker.id); }
				}
			])
		});
	}

	onTap(id: number)
	{	
		console.log("Place tapped");
		//this.router.navigate(["/place", id]);
	}
}