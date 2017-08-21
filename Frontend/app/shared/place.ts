import {MediaItem} from "./mediaItem";
import {SimpleMediaItem} from "./simpleMediaItem";

export class Place
{
    public mediaItems : Array<MediaItem> = [];

    constructor(
        public id: number, 
        public sequenceNumber: number, 
        public name: string, 
        public latitude: number, 
        public longitude: number, 
        public description: string)
    {

    }

    getMediaToDownload() : Array<SimpleMediaItem>
    {
        var result = [];
        for (let mediaItem of this.mediaItems){
            result.push(new SimpleMediaItem(mediaItem.filename, mediaItem.url));
        }
        return result;
    }
}