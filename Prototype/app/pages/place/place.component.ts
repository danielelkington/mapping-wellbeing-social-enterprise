import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from "@angular/common";
import { PageRoute } from "nativescript-angular/router";
import "rxjs/add/operator/switchMap";

import { Place, PlaceService } from "./place-service";

// Displays details of a place to the user
@Component({
    selector: "place",
    templateUrl: "pages/place/place.html",
    styleUrls: ["pages/place/place-common.css", "pages/place/place.css"]
})

export class PlaceComponent implements OnInit {
    
    private place: Place;

    constructor(
        private placeService: PlaceService,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            let id = +params['id'];
            this.placeService.getPlace(id).then(place => this.place = place);
        })
    }

    goBack(): void {
        this.location.back();
    }
}