import "reflect-metadata";
import {LocalDatabaseService} from "../shared/localDatabaseService";
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
    assert.expect(5);
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
            assert.equal(true, resultSet.some(x => x[0] == "MediaItemType"));
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
    assert.expect(20);
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
        .then(x => database.execSQL("INSERT INTO Participant(Id, EnterpriseId, Name, Bio, ImageURL, ImageFilename) " +
                                    "VALUES(1, 1, 'John', 'bio1', 'url1', 'filename1')"))
        .then(x => database.execSQL("INSERT INTO Participant(Id, EnterpriseId, Name, Bio, ImageURL, ImageFilename) " +
                                    "VALUES(2, 1, 'Sally', 'bio2', 'url2', 'filename2')"))
        .then(x => database.execSQL("INSERT INTO Place(Id, ParticipantId, SequenceNumber, Name, Latitude, Longitude, Description) " +
                                    "VALUES(1, 2, 2, 'place1', 2, 3, 'place1desc')"))
        .then(x => database.execSQL("INSERT INTO Place(Id, ParticipantId, SequenceNumber, Name, Latitude, Longitude, Description) " +
                                    "VALUES(2, 2, 1, 'place2', 4, 5, 'place2desc')"))
        .then(x => database.execSQL("INSERT INTO MediaItemType(Id, Name) " +
                                    "VALUES(1, 'Image')"))
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
            assert.equal('url1', enterprise.participants[0].imageURL);
            assert.equal('filename1', enterprise.participants[0].imageFileName);
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
        });
    return promise;
});