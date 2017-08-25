export class PathPoint
{
    constructor(
        public id: number, 
        public sequenceNumber: number, 
        public latitude: number, 
        public longitude: number)
    {
        console.log("constructing a path point with sequence number ", sequenceNumber);
    }
}