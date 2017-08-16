import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Enterprise} from "../pages/enterprises/enterprise"
var Sqlite = require("nativescript-sqlite");

@Injectable()
export class LocalDatabaseService{
    private database: any;
    databaseName: string = "backontrack.db"; //can be overriden in tests

    constructor(){
    }

    static readonly initialiseDatabaseStrings : string[] = 
        ["CREATE TABLE IF NOT EXISTS Enterprise (" +
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
        var enterprises : Array<Enterprise> = [];
        var promise = this.database.each("SELECT Id, Name, CoverImageURL, CoverImageFilename, ModifiedUTC " +
                           "FROM Enterprise", [],
            function(error, row){
                if (error){
                    console.log(JSON.stringify(error));
                    return enterprises;
                }
                enterprises.push(new Enterprise(row[0], row[1], null, true, row[2]));
            });
        promise = promise.then(x => enterprises).catch(this.handleErrors);
        return promise;
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