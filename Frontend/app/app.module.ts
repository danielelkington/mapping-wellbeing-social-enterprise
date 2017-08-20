import { NgModule } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { LISTVIEW_DIRECTIVES } from "nativescript-telerik-ui/listview/angular";
import { AppComponent } from "./app.component";

import { routes, navigatableComponents } from "./app.routing";

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
        ...navigatableComponents
    ]
})
export class AppModule { }