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