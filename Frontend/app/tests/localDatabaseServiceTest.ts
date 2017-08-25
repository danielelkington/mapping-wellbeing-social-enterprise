import "reflect-metadata";
import { LocalDatabaseService } from "../shared/localDatabaseService";
import { Enterprise } from "../shared/enterprise";
import { Participant } from "../shared/participant";
import { Place } from "../shared/place";
import { MediaItem } from "../shared/mediaItem";
import { MediaItemType } from "../shared/mediaItemType";
var Sqlite = require("nativescript-sqlite");

function setupTests(databaseName: string) : LocalDatabaseService{
    //If the database exists, delete it so multiple tests won't affect each other
    if (Sqlite.exists(databaseName)){
        Sqlite.deleteDatabase(databaseName);
    }

    var target = new LocalDatabaseService();
    target.databaseName = databaseName;
    return target;
}

QUnit.test("initialiseDatabaseIfNotExists creates database if not present", function (assert) {
    assert.expect(1);
    var databaseName = "testBackOnTrack.db";
    var target = setupTests(databaseName);
    
    var promise = target.initialiseDatabaseIfNotExists();

    //Database should exist
    return promise.then(x=> assert.equal(true, Sqlite.exists(databaseName)));
});

QUnit.test("initialiseDatabaseIfNotExists creates tables if not present", function (assert) {
    assert.expect(4);
    var databaseName = "testBackOnTrack.db";
    var target = setupTests(databaseName);

    var promise = target.initialiseDatabaseIfNotExists();

    //Tables should now be there
    return promise.then(x => new Sqlite(databaseName))
        .then(db => db.all("SELECT name FROM sqlite_master WHERE type = 'table'"))
        .then(resultSet => {
            assert.equal(true, resultSet.some(x => x[0] == "Enterprise"));
            assert.equal(true, resultSet.some(x => x[0] == "Participant"));
            assert.equal(true, resultSet.some(x => x[0] == "Place"));
            assert.equal(true, resultSet.some(x => x[0] == "MediaItem"));
        });
});

QUnit.test("getSavedEnterprises returns empty list if no enterprises saved", function(assert){
    assert.expect(1);
    var databaseName = "testBackOnTrack.db";
    var target = setupTests(databaseName);
    
    var promise = target.initialiseDatabaseIfNotExists();
    return promise.then(x => target.getSavedEnterprises())
        .then(enterprises => {assert.equal(0, enterprises.length);});
});

QUnit.test("getSavedEnterprises returns enterprises if enterprises in DB", function(assert){
    assert.expect(3);
    var databaseName = "testBackOnTrack.db";
    var target = setupTests(databaseName);

    var database: any;

    var promise = target.initialiseDatabaseIfNotExists();
    promise = promise.then(x => new Sqlite(databaseName))
        .then(db => {
            database = db;
            return database.execSQL("INSERT INTO Enterprise(Id, Name) VALUES(1, 'e1')");
        })
        .then(x => database.execSQL("INSERT INTO Enterprise(Id, Name) VALUES(2, 'e2')"));
    
    return promise.then(x => target.getSavedEnterprises())
        .then(enterprises => {
            assert.equal(2, enterprises.length);
            assert.equal('e1', enterprises.find(x => x.id == 1).name);
            assert.equal('e2', enterprises.find(x => x.id == 2).name);
        });
});

QUnit.test("getSavedEnterprise returns full details of saved enterprise", function(assert){
    assert.expect(19);
    var databaseName = "testBackOnTrack.db";
    var target = setupTests(databaseName);

    var database : any;

    var promise = target.initialiseDatabaseIfNotExists();
    promise = promise.then(x => new Sqlite(databaseName))
        .then(db => {
            database = db;
            return database.execSQL("INSERT INTO Enterprise(Id, Name) "+
                                    "VALUES(1, 'e1')");
        })
        .then(x => database.execSQL("INSERT INTO Participant(Id, EnterpriseId, Name, Bio) " +
                                    "VALUES(1, 1, 'John', 'bio1')"))
        .then(x => database.execSQL("INSERT INTO Participant(Id, EnterpriseId, Name, Bio) " +
                                    "VALUES(2, 1, 'Sally', 'bio2')"))
        .then(x => database.execSQL("INSERT INTO Place(Id, ParticipantId, SequenceNumber, Name, Latitude, Longitude, Description) " +
                                    "VALUES(1, 2, 2, 'place1', 2, 3, 'place1desc')"))
        .then(x => database.execSQL("INSERT INTO Place(Id, ParticipantId, SequenceNumber, Name, Latitude, Longitude, Description) " +
                                    "VALUES(2, 2, 1, 'place2', 4, 5, 'place2desc')"))
        .then(x => database.execSQL("INSERT INTO MediaItem(Id, PlaceId, MediaItemTypeId, Name, Filename, URL) " +
                                    "VALUES(1, 1, 1, 'pic1', 'pic1filename', 'pic1url')"))
        .then(x => database.execSQL("INSERT INTO MediaItem(Id, PlaceId, MediaItemTypeId, Name, Filename, URL) " +
                                    "VALUES(2, 1, 1, 'pic2', 'pic2filename', 'pic2url')"));
    
    promise = promise.then(x => target.getSavedEnterprise(1))
        .then(enterprise => {
            assert.equal(1, enterprise.id);
            assert.equal('e1', enterprise.name);

            assert.equal(2, enterprise.participants.length);
            assert.equal('John', enterprise.participants[0].name);
            assert.equal('bio1', enterprise.participants[0].bio);
            assert.equal('Sally', enterprise.participants[1].name);
            
            assert.equal(0, enterprise.participants[0].places.length);
            assert.equal(2, enterprise.participants[1].places.length);
            assert.equal('place2', enterprise.participants[1].places[0].name);
            assert.equal(4, enterprise.participants[1].places[0].latitude);
            assert.equal(5, enterprise.participants[1].places[0].longitude);
            assert.equal('place2desc', enterprise.participants[1].places[0].description);
            assert.equal('place1', enterprise.participants[1].places[1].name);

            assert.equal(2, enterprise.participants[1].places[1].mediaItems.length);
            assert.equal('pic1', enterprise.participants[1].places[1].mediaItems[0].name);
            assert.equal('pic1filename', enterprise.participants[1].places[1].mediaItems[0].filename);
            assert.equal('pic1url', enterprise.participants[1].places[1].mediaItems[0].url);
            assert.equal('pic2', enterprise.participants[1].places[1].mediaItems[1].name);
            assert.equal(1, enterprise.participants[1].places[1].mediaItems[1].mediaItemType);
        });
    return promise;
});

QUnit.test("saveEnterprise saves full details of enterprise", function(assert){
    assert.expect(21);
    var databaseName = "testBackOnTrack.db";
    var target = setupTests(databaseName);

    var promise = target.initialiseDatabaseIfNotExists();

    var enterprise = new Enterprise(1, "a", false, false, "google.com", "google", 1);
    enterprise.participants.push(new Participant(1, 'Fred', 'bio'));
    enterprise.participants.push(new Participant(2, 'Sally', 'bio2'));
    enterprise.participants[0].places.push(new Place(1, 1, 'placename', 2, 4, 'placeDesc'));
    enterprise.participants[0].places.push(new Place(2, 2, 'placename2', 3, 5, 'placeDesc2'));
    enterprise.participants[0].places[0].mediaItems.push(new MediaItem(1, 'mediaItem1', 'img.png', 'a.com/img.png', MediaItemType.Image));
    enterprise.participants[0].places[0].mediaItems.push(new MediaItem(2, 'mediaItem2', 'img.mp4', 'a.com/img.mp4', MediaItemType.Video));

    promise = promise.then(x => target.saveEnterprise(enterprise));
    promise = promise.then(x => target.getSavedEnterprise(1))
        .then(savedEnterprise => {
            assert.equal('a', savedEnterprise.name);
            assert.equal('google.com', savedEnterprise.imageURL);
            assert.equal('google', savedEnterprise.imageFileName);
            assert.equal(1, savedEnterprise.modifiedUTC);
            assert.equal(2, savedEnterprise.participants.length);

            assert.equal(1, savedEnterprise.participants[0].id);
            assert.equal('Fred', savedEnterprise.participants[0].name);
            assert.equal('bio', savedEnterprise.participants[0].bio);
            assert.equal(2, savedEnterprise.participants[0].places.length);

            assert.equal(1, savedEnterprise.participants[0].places[0].id);
            assert.equal(1, savedEnterprise.participants[0].places[0].sequenceNumber);
            assert.equal('placename', savedEnterprise.participants[0].places[0].name);
            assert.equal(2, savedEnterprise.participants[0].places[0].latitude);
            assert.equal(4, savedEnterprise.participants[0].places[0].longitude);
            assert.equal('placeDesc', savedEnterprise.participants[0].places[0].description);
            assert.equal(2, savedEnterprise.participants[0].places[0].mediaItems.length);

            assert.equal(1, savedEnterprise.participants[0].places[0].mediaItems[0].id);
            assert.equal('mediaItem1', savedEnterprise.participants[0].places[0].mediaItems[0].name);
            assert.equal('img.png', savedEnterprise.participants[0].places[0].mediaItems[0].filename);
            assert.equal('a.com/img.png', savedEnterprise.participants[0].places[0].mediaItems[0].url);
            assert.equal(MediaItemType.Image, savedEnterprise.participants[0].places[0].mediaItems[0].id);
        });
    return promise;
});