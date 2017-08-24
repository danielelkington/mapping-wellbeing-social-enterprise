import { EnterprisesComponent } from "./pages/enterprises/enterprises.component";
import { ParticipantsComponent } from "./pages/participants/participants.component";

export const routes = [
    { path: "", redirectTo: "/enterprises", pathMatch: "full"},
    { path: "enterprises", component: EnterprisesComponent },
    { path: "participants/:id", component: ParticipantsComponent }
];

export const navigatableComponents = [
    EnterprisesComponent,
    ParticipantsComponent
];