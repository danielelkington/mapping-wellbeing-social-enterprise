//import { Participant } from "./participants";

export class Enterprise
{
    passwordImageSrc: String;
    downloadedImageSrc: String;

    // creates an Enterprise object
    constructor(public id: number, public name: string, //public pplParticipantList: Array<Participant>
                public password: string, public downloaded: boolean, public image: string)
    {
        this.passwordImageSrc = this.hasPassword() ? "https://i.imgur.com/hGw4LON.png" : "https://i.imgur.com/qeS6SKH.png";
        this.setDownloadedImage();
    } // end constructor

    // add a participant to the array
    /*add(ptpParticipant: Participant) {
        this.pplParticipantList.push(ptpParticipant);
    } // end add*/

    hasPassword()
    {
        return this.password != null;
    } // end hasPassword

    setDownloadedImage()
    {
        this.downloadedImageSrc = this.isDownloaded() ? "" : "";
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
            this.setDownloadedImage();
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