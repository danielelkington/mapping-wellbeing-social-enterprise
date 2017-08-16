import {Place} from "./place";

export class Participant{
    public places: Array<Place> = [];

    constructor(public id: number, public name: string, public bio: string, public imageURL: string, public imageFileName: string){

    }

}