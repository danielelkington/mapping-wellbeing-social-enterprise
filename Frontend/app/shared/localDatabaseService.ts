import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Enterprise} from "../pages/enterprises/enterprise"
var Sqlite = require("nativescript-sqlite");

@Injectable()
export class LocalDatabaseService{
    private database: any;
    private databaseName: string;

    //Initialise with a database name - allows us to override in tests
    //so we don't muck up the DB on the device!
    constructor(databaseName: string = "backontrack.db"){
        this.databaseName = databaseName;
    }

    static readonly initialiseDatabaseStrings : string[] = 
        ["CREATE TABLE IF NOT EXISTS Enterprise (" +
        "   Id INTEGER PRIMARY KEY," +
        "   Name TEXT NOT NULL," +
        "   ModifiedUTC INTEGER)",
        
        "CREATE TABLE IF NOT EXISTS Participant (" +
        "   Id INTEGER PRIMARY KEY," +
        "   EnterpriseId INTEGER NOT NULL," +
        "   Name TEXT NOT NULL," +
        "   Bio TEXT," +
        "   ImageURL TEXT," +
        "   ImageFilename TEXT," +
        "   FOREIGN KEY(EnterpriseId) REFERENCES Enterprise(Id))",
        
        "CREATE TABLE IF NOT EXISTS Place (" +
        "   Id INTEGER PRIMARY KEY," +
        "   ParticipantId INTEGER NOT NULL," +
        "   SequenceNumber INTEGER NOT NULL," +
        "   Name TEXT," +
        "   Latitude INTEGER," +
        "   Longitude INTEGER," +
        "   Description TEXT," +
        "   FOREIGN KEY(ParticipantId) REFERENCES Participant(Id))",

        "CREATE TABLE IF NOT EXISTS MediaItemType (" +
        "   Id INTEGER PRIMARY KEY," +
        "   Name TEXT)",

        "CREATE TABLE IF NOT EXISTS MediaItem (" +
        "   Id INTEGER PRIMARY KEY," +
        "   PlaceId INTEGER," +
        "   MediaItemTypeId INTEGER," +
        "   Name TEXT," +
        "   Filename TEXT," +
        "   URL TEXT," +
        "   FOREIGN KEY(PlaceId) REFERENCES Place(Id)," +
        "   FOREIGN KEY(MediaItemTypeId) REFERENCES MediaItemType(Id))"
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
        //TODO
        return new Promise(function(resolve, reject){
            resolve([new Enterprise(1, 'Enterprise A', null, true, 'https://i.imgur.com/nq7E3mc.png')]);
        });
    }

    //Get complete details of a single enterprise saved locally
    getSavedEnterprise(entepriseId: number):Promise<Enterprise>{
        //TODO
        return new Promise(function(resolve, reject){
            resolve(new Enterprise(1, 'Enterprise A', null, true, 'https://i.imgur.com/nq7E3mc.png'));
        });
    }

    //Given a complete enterprise, save it to the local db
    saveEnterprise(enterprise: Enterprise):Promise<any>{
        //TODO
        return new Promise(function(resolve, reject){
            resolve(null);
        });
    }

    private handleErrors(error){
        console.log(JSON.stringify(error));
        return Observable.throw(error);
    }
}