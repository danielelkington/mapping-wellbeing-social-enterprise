//import { Participant } from "./participants";

export class Enterprise
{
    passwordImageSrc: String;
    downloadedImageSrc: String;
    downloaded: Boolean;

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

    // looks for a participant with the supplied name if one is one found then
    // returns that participant otherwise returns null
    /*getParticipant(strName: string) {
        this.pplParticipantList.forEach((ptpParticipant) => {
            if (ptpParticipant.strName === strName)
                return ptpParticipant;
        }); // end foreach

        return null;
    } // end getParticipant*/
} // end Enterprise