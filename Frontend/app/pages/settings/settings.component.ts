import { Component, NgModule } from "@angular/core";
import { Switch } from "ui/switch";
import { LocalStorageService } from"../../shared/localStorageService";
import { TextField } from "ui/text-field";

@Component({
    selector: "settings",
    templateUrl: "pages/settings/settings.html",
    styleUrls: ["pages/settings/settings-common.css"]
})

export class SettingsComponent
{
    secondsToWait: string;

    constructor(private localStorageService : LocalStorageService) {
        this.secondsToWait = this.localStorageService.getSecondsToWait().toString();
    }

    getStream()
    {
        return this.localStorageService.loadStream();
    }

    getPlaceAutoOpen()
    {
        return this.localStorageService.loadAutoOpenPlace();
    }

    public streamSwitchChanged(args)
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
    }

    public autoOpenPlaceSwitchChanged(args)
    {
        let streamSwitch = <Switch>args.object;
        
        if (streamSwitch.checked)
        {
            this.localStorageService.saveAutoOpenPlace(true);
        }
        else
        {
            this.localStorageService.saveAutoOpenPlace(false);
        }
    }

    public fakeOpenPlaceSwitchChanged(args){
        let fakeOpenPlaceSwitch = <Switch>args.object;
        this.localStorageService.saveFakeOpenPlace(fakeOpenPlaceSwitch.checked);
    }

    public onTextChange(args){
        let textField = <TextField>args.object;
        let seconds = Number(textField.text);
        if (seconds){
            this.localStorageService.saveSecondsToWait(seconds);
        }
    }

    public getFakeOpenPlace():boolean{
        return this.localStorageService.getFakeOpenPlace();
    }
}