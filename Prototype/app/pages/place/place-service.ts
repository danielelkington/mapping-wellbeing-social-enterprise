import { Injectable } from '@angular/core';

export class Place {
    constructor(public id: number, public name: string, public desc: string) { }
}

@Injectable()
export class PlaceService {

    private PLACES = [
        new Place(0, 'The Engineering Building', 'Every time Bob went to the Engineering Building he felt better. The best lectures were in this building, he could catch up with friends easily, and he could visit his favourite staff members in their offices. He now often volunteers to help struggling classmates in some of the classrooms during his tutorials.\n\nFor example, there was the day when Bob was feeling a bit down, until he remembered that his favourite subject, Introduction to Programming, was having its lecture in the EN building. His day was brightened as he entered the familiar place, found his lecture on the fourth floor, and sat captivated as the lecturer explained how a computer turns readable code into instructions it can understand. Amazing how much a building can do!'),
        new Place(1, 'Swinburne ATC', 'The Advanced Technologies Centre'),
        new Place(2, 'Swinburne AMDC', 'The Advanced Manufacturing and Design Centre'),
        new Place(3, 'Swinburne LB', 'The Swinburne Library'),
        new Place(4, 'Swinburne BA', 'The Business and Arts Building'),
        new Place(5, 'Swinburne GS', 'The George Swinburne Building')
    ]
    private promise = Promise.resolve(this.PLACES);

    getPlace(id: number | string) {
        return this.promise.then(places => places.find(place => place.id === +id));
    }
}