import { EnterprisesComponent } from "./pages/enterprises/enterprises.component";

export const routes = [
    { path: "", redirectTo: "/enterprises", pathMatch: "full" },
    { path: "enterprises", component: EnterprisesComponent } //,
];

export const navigatableComponents = [
    EnterprisesComponent,
];