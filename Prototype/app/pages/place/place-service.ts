import { Injectable } from '@angular/core';

export class Place {
    constructor(public id: number, public name: string, public desc: string) { }
}

@Injectable()
export class PlaceService {

    private PLACES = [
        new Place(0, 'The Engineering Building', 'Every time Bob went to the Engineering Building he felt better. The best lectures were in this building, he could catch up with friends easily, and he could visit his favourite staff members in their offices. He now often volunteers to help struggling classmates in some of the classrooms during his tutorials.\n\nFor example, there was the day when Bob was feeling a bit down, until he remembered that his favourite subject, Introduction to Programming, was having its lecture in the EN building. His day was brightened as he entered the familiar place, found his lecture on the fourth floor, and sat captivated as the lecturer explained how a computer turns readable code into instructions it can understand. Amazing how much a building can do!'),
        new Place(1, 'Swinburne ATC', 'The Advanced Technologies Centre'),
        new Place(2, 'A new tree', 'This is the tree I helped plant and prune. I heard about how you can volunteer at the local council, and decided to give it a go. Almost six months ago I spent an afternoon digging the soil, putting it in, fertilizing it, and building a small support. Every fortnight since I\'ve come to check on it, water it, and eventually remove the supports when it could stand up by itself. I feel like I\'m doing my part; all the kids come here for their birthday parties, and hopefully they\'ll have a bit more shade in the summer. I wouldn\'t be doing this sort of stuff if it wasn\'t for the Community Garden, it really helped me to get Back on Track.'),
        new Place(3, 'A new tree', 'This is the tree I helped plant and prune. I heard about how you can volunteer at the local council, and decided I would give it a go. Almost six months ago I spent an afternoon digging the soil, putting it in, feeding it, and building a small support. Every fortnight since I\'ve come to check on it, water it, and eventually remove the supports when it could stand up by itself. I feel like I\'m doing my part; all the kids come here for their birthday parties, and hopefully they\'ll have a bit more shade in the summer. I remember when I was a kid, I used to get such a dreadful sunburn in the summer, and of course with Climate Change and the Ozone hole and all it\'s much worse these days, simply hard to imagine. And you know, planting trees has so many benefits; for shade, providing cleaner air for us to breath, providing a home for small animals and birds. You know, I certainly wouldn\'t be doing this sort of stuff - not at all - if it wasn\'t for the Community Garden. It really helped me to get Back on Track.'),
        new Place(4, 'Swinburne BA', ''),
        new Place(5, 'Swinburne GS', 'The George Swinburne Building')
    ]
    private promise = Promise.resolve(this.PLACES);

    getPlace(id: number | string) {
        return this.promise.then(places => places.find(place => place.id === +id));
    }
}