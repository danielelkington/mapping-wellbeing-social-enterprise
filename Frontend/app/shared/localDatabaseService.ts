import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Enterprise} from "./enterprise"
import {Participant} from "./participant";
import {Place} from "./place";
import {PathPoint} from "./pathPoint";
import {MediaItem} from "./mediaItem";
var Sqlite = require("nativescript-sqlite");

@Injectable()
export class LocalDatabaseService{
    private database: any;
    databaseName: string = "backontrack.db"; //can be overriden in tests

    constructor(){
    }

    static readonly initialiseDatabaseStrings : string[] = 
        ["PRAGMA foreign_keys = ON",
        "CREATE TABLE IF NOT EXISTS Enterprise (" +
        "   Id INTEGER PRIMARY KEY," +
        "   Name TEXT NOT NULL," +
        "   CoverImageURL TEXT," +
        "   CoverImageFilename TEXT," +
        "   ModifiedUTC INTEGER)",
        
        "CREATE TABLE IF NOT EXISTS Participant (" +
        "   Id INTEGER PRIMARY KEY," +
        "   EnterpriseId INTEGER NOT NULL," +
        "   Name TEXT NOT NULL," +
        "   Bio TEXT," +
        "   FOREIGN KEY(EnterpriseId) REFERENCES Enterprise(Id) ON DELETE CASCADE)",
        
        "CREATE TABLE IF NOT EXISTS Place (" +
        "   Id INTEGER PRIMARY KEY," +
        "   ParticipantId INTEGER NOT NULL," +
        "   SequenceNumber INTEGER NOT NULL," +
        "   Name TEXT," +
        "   Latitude REAL," +
        "   Longitude REAL," +
        "   Description TEXT," +
        "   FOREIGN KEY(ParticipantId) REFERENCES Participant(Id) ON DELETE CASCADE)",

        "CREATE TABLE IF NOT EXISTS PathPoint (" +
        "   Id INTEGER PRIMARY KEY," +
        "   ParticipantId INTEGER NOT NULL," +
        "   SequenceNumber INTEGER NOT NULL," +
        "   Latitude REAL," +
        "   Longitude REAL," +
        "   FOREIGN KEY(ParticipantId) REFERENCES Participant(Id) ON DELETE CASCADE)",

        "CREATE TABLE IF NOT EXISTS MediaItem (" +
        "   Id INTEGER PRIMARY KEY," +
        "   PlaceId INTEGER," +
        "   MediaItemTypeId INTEGER," +
        "   Name TEXT," +
        "   Filename TEXT," +
        "   URL TEXT," +
        "   FOREIGN KEY(PlaceId) REFERENCES Place(Id) ON DELETE CASCADE)"
    ];

    initialiseDatabaseIfNotExists(){
        var promise = new Sqlite(this.databaseName)
            .then(db => {this.database = db;});
        
        //Create all the tables in the db if they don't exist
        for (let initialiseDbStatement of LocalDatabaseService.initialiseDatabaseStrings){
            promise = promise.then(x => this.database.execSQL(initialiseDbStatement),
            this.handleErrors);
        }

        promise.catch(this.handleErrors);
        return promise;
    }

    //Get a list of basic details of all enterprises saved locally
    getSavedEnterprises():Promise<Array<Enterprise>>{
        var enterprises : Array<Enterprise> = [];
        var promise = this.database.each("SELECT Id, Name, CoverImageURL, CoverImageFilename, ModifiedUTC " +
                           "FROM Enterprise", [],
            function(error, row){
                if (error){
                    console.log(JSON.stringify(error));
                    return enterprises;
                }
                enterprises.push(new Enterprise(row[0], row[1], /*downloaded:*/true, /*haspassword*/false, row[2], row[3], row[4]));
            });
        promise = promise.then(x => enterprises).catch(this.handleErrors);
        return promise;
    }

    //Get complete details of a single enterprise saved locally
    getSavedEnterprise(enterpriseId: number):Promise<Enterprise>{
        var enterprise : Enterprise = null;
        var promise = this.database.get(
            "SELECT Id, Name, CoverImageURL, CoverImageFilename, ModifiedUTC " +
            "FROM Enterprise " +
            "WHERE Id = ?", [enterpriseId]);
        promise = promise.then(row => {
            enterprise = new Enterprise(row[0], row[1], /*downloaded*/true, /*haspassword*/false, row[2], row[3], row[4]);
        });
        promise = promise.then(x => this.database.each(
            "SELECT Id, Name, Bio " +
            "FROM Participant " +
            "WHERE EnterpriseId = ? " +
            "ORDER BY Name", [enterpriseId],
            function(error, row) {
                if (error){
                    this.handleErrors(error);
                }
                enterprise.participants.push(new Participant(row[0], row[1], row[2]));
            }
        ));
        promise = promise.then(x => {
            var placePromises : Array<Promise<any>> = [];
            for (let participant of enterprise.participants){
                placePromises.push(this.populatePlacesInParticipant(participant));
            }
            return Promise.all(placePromises);
        });
        promise = promise.then(x => {
            var pathPointPromises : Array<Promise<any>> = [];
            for (let participant of enterprise.participants){
                pathPointPromises.push(this.populatePathPointsInParticipant(participant));
            }
            return Promise.all(pathPointPromises);
        });
        promise = promise.then(x => enterprise);
        promise.catch(this.handleErrors);
        return promise;
    }

    //Given a complete enterprise, save it to the local db
    saveEnterprise(enterprise: Enterprise):Promise<any>{
        var promise = this.database.execSQL(
            "INSERT INTO Enterprise(Id, Name, CoverImageURL, CoverImageFilename, ModifiedUTC) " +
            "VALUES(?,?,?,?,?)",
            [enterprise.id, enterprise.name, enterprise.imageURL, enterprise.imageFileName, enterprise.modifiedUTC]
        );
        
        for(let participant of enterprise.participants){
            promise = promise.then(x => this.database.execSQL(
                "INSERT INTO Participant(Id, EnterpriseId, Name, Bio) " +
                "VALUES(?,?,?,?)",
                [participant.id, enterprise.id, participant.name, participant.bio]
            ));
            
            for (let place of participant.places){
                promise = promise.then(x => this.database.execSQL(
                    "INSERT INTO Place(Id, ParticipantId, SequenceNumber, Name, Latitude, Longitude, Description) " +
                    "VALUES(?,?,?,?,?,?,?)",
                    [place.id, participant.id, place.sequenceNumber, place.name, place.latitude, place.longitude, place.description]
                ));
                for (let mediaItem of place.mediaItems){
                    promise = promise.then(x => this.database.execSQL(
                        "INSERT INTO MediaItem(Id, PlaceId, MediaItemTypeId, Name, Filename, URL) " +
                        "VALUES(?,?,?,?,?,?)",
                        [mediaItem.id, place.id, mediaItem.mediaItemType, mediaItem.name, mediaItem.filename, mediaItem.url]
                    ));
                }
            }

            for (let pathPoint of participant.pathPoints){
                promise = promise.then(x => this.database.execSQL(
                    "INSERT INTO PathPoint(Id, ParticipantId, SequenceNumber, Latitude, Longitude) " +
                    "VALUES(?,?,?,?,?)",
                    [pathPoint.id, participant.id, pathPoint.sequenceNumber, pathPoint.latitude, pathPoint.longitude]
                ));
            }
        }
        
        promise.catch(this.handleErrors);
        return promise;
    }

    deleteEnterprise(enterpriseId: number): Promise<any>{
        var promise = this.database.execSQL("DELETE FROM Enterprise WHERE Id = ?", [enterpriseId]);
        promise.catch(this.handleErrors);
        return promise;
    }

    private handleErrors(error){
        console.log(JSON.stringify(error));
        return Observable.throw(error);
    }

    private populatePlacesInParticipant(participant : Participant):Promise<any>{
        var promise = this.database.each(
            "SELECT Id, SequenceNumber, Name, Latitude, Longitude, Description " +
            "FROM Place " +
            "WHERE ParticipantId = ? " +
            "ORDER BY SequenceNumber", [participant.id],
            function(error, row) {
                if (error){
                    this.handleErrors(error);
                }
                participant.places.push(new Place(row[0], row[1], row[2], row[3], row[4], row[5]));
            }
        );
        promise = promise.then(x => {
            var mediaItemPromises : Array<Promise<any>> = [];
            for (let place of participant.places){
                mediaItemPromises.push(this.populateMediaItemsInPlace(place));
            }
            return Promise.all(mediaItemPromises);
        });
        return promise;
    }

    private populateMediaItemsInPlace(place: Place):Promise<any>{
        var promise = this.database.each(
            "SELECT Id, Name, Filename, URL, MediaItemTypeId " +
            "FROM MediaItem " +
            "WHERE PlaceId = ?", [place.id],
            function(error, row) {
                if (error){
                    this.handleErrors(error);
                }
                place.mediaItems.push(new MediaItem(row[0], row[1], row[2], row[3], row[4]));
            }
        );
        return promise;
    }

    private populatePathPointsInParticipant(participant : Participant):Promise<any>{
        var promise = this.database.each(
            "SELECT Id, SequenceNumber, Latitude, Longitude " +
            "FROM PathPoint " +
            "WHERE ParticipantId = ? " +
            "ORDER BY SequenceNumber", [participant.id],
            function(error, row) {
                if (error){
                    this.handleErrors(error);
                }
                participant.pathPoints.push(new PathPoint(row[0], row[1], row[2], row[3]));
            }
        );
        return promise;
    }
}