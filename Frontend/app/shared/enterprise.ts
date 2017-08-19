import { Participant } from "./participant";
import { Place } from "./place";
import { MediaItem } from "./mediaItem";
import { SimpleMediaItem } from "./simpleMediaItem";

export class Enterprise
{
    passwordImageSrc: String;
    downloadedImageSrc: String;
    public busy: Boolean = false;
    public totalThingsToDownload: number = 10;
    public numberDownloaded: number = 0;
    public participants: Array<Participant> = [];    

    // creates an Enterprise object
    constructor(public id: number, public name: string, public downloaded: Boolean,
                public hasPassword: Boolean, public imageURL: string, public imageFileName: string, public modifiedUTC: number)
    {
        if (this.hasPassword)
            this.lock();
        this.setDownloadedImage();
    }

    //Given some JSON, try to construct the full enterprise object graph from it
    public static EnterpriseFromJSON(enterpriseJSON) : Enterprise{
        //Enterprise
        var enterprise = new Enterprise(enterpriseJSON.Id, enterpriseJSON.Name, 
            /*downloaded:*/true, /*hasPassword*/false, 
            enterpriseJSON.CoverImageURL, enterpriseJSON.CoverImageFilename, 
            enterpriseJSON.ModifiedUTC);
        //Participants
        enterpriseJSON.Participants.forEach(participantJSON => {
            var participant = new Participant(participantJSON.Id, participantJSON.Name, 
                participantJSON.Bio, participantJSON.ImageUrl, participantJSON.ImageFilename);
            
            //Places
            participantJSON.Places.forEach(placeJSON => {
                var place = new Place(placeJSON.Id, placeJSON.SequenceNumber, 
                    placeJSON.Name, placeJSON.Latitude, placeJSON.Longitude, placeJSON.Description);
            
                //MediaItems
                placeJSON.MediaItems.forEach(mediaItemJSON => {
                    var mediaItem = new MediaItem(mediaItemJSON.Id, mediaItemJSON.Name, 
                        mediaItemJSON.Filename, mediaItemJSON.URL, mediaItemJSON.MediaItemTypeId);
                    place.mediaItems.push(mediaItem);
                });
                participant.places.push(place);
            });
            enterprise.participants.push(participant);
        });
        return enterprise;
    }

    lock()
    {
        if (this.hasPassword)
            this.passwordImageSrc = "https://i.imgur.com/L2lNjOC.png";
    }

    setDownloaded()
    {
        this.downloaded = true;
        this.setDownloadedImage();
        this.passwordImageSrc = null;
        this.hasPassword = false;
    }

    setDownloadedImage()
    {
        this.downloadedImageSrc = this.isDownloaded() ? null : "https://i.imgur.com/nJyft0f.png";
    }

    isDownloaded()
    {
        return this.downloaded;
    }

    getMediaToDownload() : Array<SimpleMediaItem>
    {
        var result = [new SimpleMediaItem(this.imageFileName, this.imageURL)];
        for (let participant of this.participants){
            result = result.concat(participant.getMediaToDownload());
        }
        return result;
    }

}