import { EnterprisesComponent } from "./pages/enterprises/enterprises.component";
import { ParticipantsComponent } from "./pages/participants/participants.component";
import { MapComponent } from "./pages/map/map.component";
import { PlaceComponent } from "./pages/place/place.component";

export const routes = [
    { path: "", redirectTo: "/enterprises", pathMatch: "full" },
    { path: "enterprises", component: EnterprisesComponent },
    { path: "participants", component: ParticipantsComponent },
    { path: "map", component: MapComponent },
    { path: "place/:id", component: PlaceComponent }
];

export const navigatableComponents = [
    EnterprisesComponent,
    ParticipantsComponent,
    MapComponent,
    PlaceComponent
];