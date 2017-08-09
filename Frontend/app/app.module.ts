import { NgModule } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AppComponent } from "./app.component";
import { registerElement } from "nativescript-angular/element-registry";

import { routes, navigatableComponents } from "./app.routing";

//Allow the 'MapBox' element to be used in HTML.
var map = require("nativescript-mapbox");
registerElement("Mapbox", () => map.Mapbox);

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ],
    declarations: [
        AppComponent,
        ...navigatableComponents
    ],
    providers: [
    ]
})
export class AppModule { }
