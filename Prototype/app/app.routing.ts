import { EnterprisesComponent } from "./pages/enterprises/enterprises.component";
import { MapComponent } from "./pages/map/map.component";
import { PlaceComponent } from "./pages/place/place.component";

export const routes = [
    { path: "", redirectTo: "/enterprises", pathMatch: "full" },
    { path: "enterprises", component: EnterprisesComponent },
    { path: "map", component: MapComponent },
    { path: "place/:id", component: PlaceComponent }
];

export const navigatableComponents = [
    EnterprisesComponent,
    MapComponent,
    PlaceComponent
];