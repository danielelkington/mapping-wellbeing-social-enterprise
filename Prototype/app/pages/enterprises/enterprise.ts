export class Enterprise {
    passwordImageSrc: String;

    // creates an Enterprise object
    constructor(public numID: number, public strName: string, public strPassword: string, public imageRef: string) {
        this.passwordImageSrc = this.hasPassword() ? "https://i.imgur.com/hGw4LON.png" : "https://i.imgur.com/qeS6SKH.png";
    } // end constructor

    hasPassword() {
        return this.strPassword != null;
    } // end hasPassword
} // end Enterprise