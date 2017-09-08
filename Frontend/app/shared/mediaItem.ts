import { MediaItemType } from "./mediaItemType";

export class MediaItem
{
    mediaPath: string; //either a URL or local file location
    audioPlaying: boolean = false;

    constructor(public id: number, public name: string, public filename: string, public url: string, public mediaItemType: MediaItemType)
    {
    }
}