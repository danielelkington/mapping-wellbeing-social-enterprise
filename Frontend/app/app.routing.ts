import { EnterprisesComponent } from "./pages/enterprises/enterprises.component";
import { ParticipantsComponent } from "./pages/participants/participants.component";
import { MapComponent } from "./pages/map/map.component";
import { PlaceComponent } from "./pages/place/place.component";
import { InfoComponent } from "./pages/info/info.component";
import { SettingsComponent } from "./pages/settings/settings.component";

export const routes = [
    { path: "", redirectTo: "/enterprises", pathMatch: "full" },
    { path: "info", component: InfoComponent },
    { path: "settings", component: SettingsComponent },
    { path: "enterprises", component: EnterprisesComponent },
    { path: "participants/:id", component: ParticipantsComponent },
    { path: "map/:eId/:pId", component: MapComponent },
    { path: "place/:eId/:pId/:sId", component: PlaceComponent }
];

export const navigatableComponents = [
    EnterprisesComponent,
    ParticipantsComponent,
    MapComponent,
    PlaceComponent,
    InfoComponent,
    SettingsComponent
];