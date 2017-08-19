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
}