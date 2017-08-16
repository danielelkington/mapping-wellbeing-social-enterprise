import {MediaItem} from "./mediaItem";

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
}