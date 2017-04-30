import { Injectable } from '@angular/core';

export class Place {
    constructor(public id: number, public name: string, public desc: string) { }
}

@Injectable()
export class PlaceService {

    private PLACES = [
        new Place(0, 'Swinburne EN', 'The Engineering Building'),
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