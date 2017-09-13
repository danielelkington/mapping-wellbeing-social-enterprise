import {Injectable} from "@angular/core";

//A class with common utilities that has a single shared instance throughout the application
@Injectable()
export class Common{
    //Getting the ActionBarHeight from a page in Nativescript is buggy if you try to get it
    //as soon as the page loads. Better to save this in another page before using it in the 
    //desired page
    private actionBarHeight: number = 58; //58 is a nice default value

    setActionBarHeight(actionBarHeight: number){
        if (actionBarHeight > 0){
            console.log("Setting action bar height to ", actionBarHeight/2);
            this.actionBarHeight = actionBarHeight/2;
        }
    }

    getActionBarHeight():number{
        console.log("Retrieving action bar height which is  ", this.actionBarHeight);
        return this.actionBarHeight;
    }
}