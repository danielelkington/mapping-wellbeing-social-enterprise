import { Component, OnInit } from "@angular/core";
import { Config } from "../../config";
import { Router, NavigationExtras } from "@angular/router";
import * as geolocation from "nativescript-geolocation";
 
// Displays a map associated with an enterprise to the user and allows
// them to select a place.
@Component({
	selector: "map",
	templateUrl: "pages/map/map.html",
	styleUrls: ["pages/map/map-common.css", "pages/map/map.css"]
})
export class MapComponent implements OnInit {
	mapboxAccessToken = Config.mapboxAccessToken;

	private map: any

	constructor(
    	private router : Router
  ) {}

  ngOnInit(){
    //Allows us to show the user's location on the map.
    if (!geolocation.isEnabled()){
      geolocation.enableLocationRequest();
    }
  }

	onMapReady(args) {
		this.map = args.map;
		args.map.addMarkers([
			{
				lat: -37.8223,
				lng: 145.03784,
				id: 0,
				title: 'Swinburne EN',
				subtitle: 'The Engineering Building',
				icon: 'https://i.imgur.com/cdFPldG.png',
				onCalloutTap: (marker) => { this.onTap(marker.id); }
			},
			{
				lat: -37.8228,
				lng: 145.03842,
				id: 1,
				title: 'Swinburne ATC',
				subtitle: 'The Advanced Technologies Centre',
				icon: 'https://i.imgur.com/SRuzpbn.png',
				onCalloutTap: (marker) => { this.onTap(marker.id); }
			},
			{
				lat: -37.8229,
				lng: 145.03925,
				id: 2,
				title: 'Swinburne AMDC',
				subtitle: 'The Advanced Manufacturing and Design Centre',
				icon: 'https://i.imgur.com/C4pv4eZ.png',
				onCalloutTap: (marker) => { this.onTap(marker.id); }
			},
			{
				lat: -37.8225,
				lng: 145.03935,
				id: 3,
				title: 'Swinburne LB',
				subtitle: 'The Swinburne Library',
				icon: 'https://i.imgur.com/eInZqUj.png',
				onCalloutTap: (marker) => { this.onTap(marker.id); }
			},
			{
				lat: -37.8221,
				lng: 145.03940,
				id: 4,
				title: 'Swinburne BA',
				subtitle: 'The Business and Arts Building',
				icon: 'https://i.imgur.com/92R3pMP.png',
				onCalloutTap: (marker) => { this.onTap(marker.id); }
			},
			{
				lat: -37.8214,
				lng: 145.03846,
				id: 5,
				title: 'Swinburne GS',
				subtitle: 'The George Swinburne Building',
				icon: 'https://i.imgur.com/mJKaUem.png',
				onCalloutTap: (marker) => { this.onTap(marker.id); }
			}]
		);
	}

	onTap(id: number) {	
		this.router.navigate(["/place", id]);
	}
}