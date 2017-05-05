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
				lat: -37.757167,
				lng: 145.347030,
				id: 0,
				title: 'By the train station',
        		subtitle: 'Trees planted near the local train station',
				icon: 'https://i.imgur.com/kYqCLAz.png',
				onCalloutTap: (marker) => { this.onTap(marker.id); }
			},
			{
				lat: -37.751435,
				lng: 145.351357,
				id: 1,
				title: 'The creek',
				subtitle: 'Helping out down by the creek',
				icon: 'https://i.imgur.com/vZ5C0tZ.png',
				onCalloutTap: (marker) => { this.onTap(marker.id); }
			},
			{
				lat: -37.753930,
				lng: 145.348398,
				id: 2,
				title: 'Local charity',
				subtitle: 'Maintaining the garden at a local charity',
				icon: 'https://i.imgur.com/8kB8Kj1.png',
				onCalloutTap: (marker) => { this.onTap(marker.id); }
			},
			{
				lat: -37.755436,
				lng: 145.352648,
				id: 3,
				title: 'A new tree',
				subtitle: 'A new tree has appeared in the local park...',
				icon: 'https://i.imgur.com/z6UNnAj.png',
				onCalloutTap: (marker) => { this.onTap(marker.id); }
			}]
		);
	}

	onTap(id: number) {	
		this.router.navigate(["/place", id]);
	}
}