import { Component, NgModule } from "@angular/core";
import { Switch } from "ui/switch";
import { LocalStorageService } from"../../shared/localStorageService";

@Component({
    selector: "settings",
    templateUrl: "pages/settings/settings.html",
    styleUrls: ["pages/settings/settings-common.css"]
})

export class SettingsComponent
{
    constructor(private localStorageService : LocalStorageService) {}

    getStream()
    {
        return this.localStorageService.loadStream();
    }

    public switchChanged(args)
    {
        let streamSwitch = <Switch>args.object;
        
        if (streamSwitch.checked)
        {
            this.localStorageService.saveStream(true);
        }
        else
        {
            this.localStorageService.saveStream(false);
        }

        console.log("switch is " + this.localStorageService.loadStream());
    }
}