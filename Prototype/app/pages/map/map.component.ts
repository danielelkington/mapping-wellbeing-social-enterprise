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

    private map: any

  onMapReady(args)
  {
    this.map = args.map;
    args.map.addMarkers([
        {
          lat: -37.8223,
          lng: 145.03784,
          title: 'Swinburne EN',
          subtitle: 'The Engineering Building',
          icon: 'https://i.imgur.com/cdFPldG.png'
        },
        {
          lat: -37.8228,
          lng: 145.03842,
          title: 'Swinburne ATC',
          subtitle: 'The Advanced Technologies Centre',
          icon: 'https://i.imgur.com/SRuzpbn.png'
        },
        {
          lat: -37.8229,
          lng: 145.03925,
          title: 'Swinburne AMDC',
          subtitle: 'The Advanced Manufacturing and Design Centre',
          icon: 'https://i.imgur.com/C4pv4eZ.png'
        },
        {
          lat: -37.8225,
          lng: 145.03935,
          title: 'Swinburne LB',
          subtitle: 'The Swinburne Library',
          icon: 'https://i.imgur.com/eInZqUj.png'
        },
        {
          lat: -37.8221,
          lng: 145.03940,
          title: 'Swinburne BA',
          subtitle: 'The Business and Arts Building',
          icon: 'https://i.imgur.com/92R3pMP.png'
        },
        {
          lat: -37.8214,
          lng: 145.03846,
          title: 'Swinburne GS',
          subtitle: 'The George Swinburne Building',
          icon: 'https://i.imgur.com/mJKaUem.png'
        }]
      );
  }
}