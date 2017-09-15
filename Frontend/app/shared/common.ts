import {Injectable} from "@angular/core";

//A class with common utilities that has a single shared instance throughout the application
@Injectable()
export class Common{
    //How often to update the location to see if we are near a place (on Android)
	public static readonly updateLocationTimeMilliseconds: number = 1000;
	//How recent location data should have been from - we will ignore anything older
	public static readonly maximumAgeOfLocationMilliseconds: number = 5000;
	//How close we have to be to a place before it opens
	public static readonly smallLocationThesholdMeters: number = 20;
	//How far we have to be from a place before it closes
	public static readonly bigLocationThresholdMeters: number = 30;


    //Getting the ActionBarHeight from a page in Nagtivescript is buggy if you try to get it
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

    private placeIdCameNear: number = null;
    setPlaceIdCameNear(placeIdCameNear: number){
        console.log("Have come near to ", placeIdCameNear);
        this.placeIdCameNear = placeIdCameNear;
    }
    getPlaceIdCameNear():number{
        return this.placeIdCameNear;
    }
}
