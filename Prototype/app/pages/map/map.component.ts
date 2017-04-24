import { Component } from "@angular/core";
import { Config } from "../../config";

// Displays a map associated with an enterprise to the user and allows
// them to select a place.
@Component({
    selector: "map",
    templateUrl: "pages/map/map.html",
    styleUrls: ["pages/map/map-common.css", "pages/map/map.css"]
})
export class MapComponent{
    mapboxAccessToken = Config.mapboxAccessToken;
}