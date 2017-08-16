import {Place} from "./place";

export class Participant{
    public places: Array<Place> = [];

    constructor(public id: number, public name: string, public bio: string, public imageURL: string, public imageFileName: string){

    }

    numberOfThingsToDownload(): number{
        var count = 2; //participant image + map
        for(let place of this.places){
            count += place.numberOfThingsToDownload();
        }
        return count;
    }
}