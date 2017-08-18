import { Participant } from "./participant";

export class Enterprise
{
    passwordImageSrc: String;
    downloadedImageSrc: String;
    public busy: Boolean = false;
    public downloadProgressPercentage: Number = 0;
    public participants: Array<Participant> = [];    

    // creates an Enterprise object
    constructor(public id: number, public name: string, public downloaded: Boolean,
                public hasPassword: Boolean, public image: string)
    {
        if (this.hasPassword)
            this.lock();
        this.setDownloadedImage();
    } // end constructor

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

    numberOfThingsToDownload(): number
    {
        var count = 1; //enterprise image
        for(let participant of this.participants)
        {
            count += participant.numberOfThingsToDownload();
        }
        return count;
    }

}