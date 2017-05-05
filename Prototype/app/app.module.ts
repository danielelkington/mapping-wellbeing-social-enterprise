import { NgModule } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AppComponent } from "./app.component";
import { registerElement } from "nativescript-angular/element-registry";

import { routes, navigatableComponents } from "./app.routing";
import { PlaceService } from "./pages/place/place-service";

//Allow the 'MapBox' element to be used in HTML.
var map = require("nativescript-mapbox");
registerElement("Mapbox", () => map.Mapbox);

var ripple = require("nativescript-ripple");
registerElement("Ripple", () => ripple.Ripple);

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
        PlaceService
    ]
})
export class AppModule { }
