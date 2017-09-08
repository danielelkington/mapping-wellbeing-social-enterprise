import { NgModule } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { LISTVIEW_DIRECTIVES } from "nativescript-telerik-ui/listview/angular";
import { SIDEDRAWER_DIRECTIVES } from "nativescript-telerik-ui/sidedrawer/angular";
import { AppComponent } from "./app.component";
import { registerElement } from "nativescript-angular/element-registry";
import { LocalDatabaseService } from"./shared/localDatabaseService";
import { LocalStorageService } from"./shared/localStorageService";

import { routes, navigatableComponents } from "./app.routing";

//Allow the 'MapBox' element to be used in HTML.
registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView);

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptHttpModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ],
    declarations: [
        AppComponent,
        LISTVIEW_DIRECTIVES,
        SIDEDRAWER_DIRECTIVES,
        ...navigatableComponents
    ],
    providers: [
        LocalDatabaseService,
        LocalStorageService
    ]
})
export class AppModule { }