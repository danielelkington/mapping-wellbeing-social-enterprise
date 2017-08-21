import {Place} from "./place";
import {SimpleMediaItem} from "./simpleMediaItem";

export class Participant{
    public places: Array<Place> = [];

    constructor(public id: number, public name: string, public bio: string, public imageURL: string, public imageFileName: string){

    }

    getMediaToDownload() : Array<SimpleMediaItem>
    {
        var result = [new SimpleMediaItem(this.imageFileName, this.imageURL)];
        for (let place of this.places){
            result = result.concat(place.getMediaToDownload());
        }
        return result;
    }

    getMaxNorthBound() : number{
        var maxNorth = -90;
        for (let place of this.places){
            if (place.latitude > maxNorth){
                maxNorth = place.latitude;
            }
        }
        return maxNorth;
    }

    getMaxSouthBound() : number{
        var maxSouth = 90;
        for (let place of this.places){
            if (place.latitude < maxSouth){
                maxSouth = place.latitude;
            }
        }
        return maxSouth;
    }

    getMaxEastBound() : number{
        //Warning: this algorithm will work in most situations, except
        //where a social enterprise crosses 180 degrees longitude/the International Date Line.
        //That's unlikely, but if it ever happens, this code should be refactored or you'll 
        //download WAY too much!
        var maxEast = -200;
        for (let place of this.places){
            if (place.longitude > maxEast){
                maxEast = place.longitude;
            }
        }
        return maxEast;
    }

    getMaxWestBound() : number{
        //Warning: same as for East.
        var maxWest = 200;
        for (let place of this.places){
            if (place.longitude < maxWest){
                maxWest = place.longitude;
            }
        }
        return maxWest;
    }
}