import { Participant } from "./participant";

export class Enterprise
{
    passwordImageSrc: String;
    downloadedImageSrc: String;
    downloaded: Boolean;
    public participants: Array<Participant> = [];

    // creates an Enterprise object
    constructor(public id: number, public name: string, //public pplParticipantList: Array<Participant>
                public password: string, public image: string)
    {
        if (this.hasPassword())
            this.lock();
    } // end constructor

    // add a participant to the array
    /*add(ptpParticipant: Participant) {
        this.pplParticipantList.push(ptpParticipant);
    } // end add*/

    hasPassword()
    {
        return this.password != null;
    } // end hasPassword

    lock()
    {
        if (this.password != null)
            this.passwordImageSrc = "https://i.imgur.com/L2lNjOC.png";
    }

    unlock()
    {
        this.passwordImageSrc = null;
    }

    setDownloaded()
    {
        //downloaded = Enterprise found on local storage ? true : false;
        this.downloadedImageSrc = this.isDownloaded() ? "https://i.imgur.com/KmQ9WNS.png" : "https://i.imgur.com/AlWlXQo.png";
    }

    isDownloaded()
    {
        return this.downloaded;
    }

    download()
    {
        if (!this.isDownloaded())
        {
            this.downloaded = true;
            this.setDownloaded();
        }
    }

}