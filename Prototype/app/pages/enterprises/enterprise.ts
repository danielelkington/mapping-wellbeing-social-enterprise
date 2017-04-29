import { Participant } from "./participants";

export class Enterprise {

    // creates an Enterprise object
    constructor(public numID: number, public strName: string, public pplParticipantList: Array<Participant>, public strPassword: string,
        public blnPassword: boolean) {
    } // end constructor

    // add a participant to the array
    add(ptpParticipant: Participant) {
        this.pplParticipantList.push(ptpParticipant);
    } // end add

    hasPassword() {
        return this.blnPassword;
    } // end hasPassword

    // looks for a participant with the supplied name if one is one found then
    // returns that participant otherwise returns null
    getParticipant(strName: string) {
        this.pplParticipantList.forEach((ptpParticipant) => {
            if (ptpParticipant.strName === strName)
                return ptpParticipant;
        }); // end foreach

        return null;
    } // end getParticipant
} // end Enterprise