import { MediaItemType } from "./mediaItemType";

export class MediaItem
{
    constructor(public id: number, public name: string, public filename: string, public url: string, public mediaItemType: MediaItemType)
    {
    }
}