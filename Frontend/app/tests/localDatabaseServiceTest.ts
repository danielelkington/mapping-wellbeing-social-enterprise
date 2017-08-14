import "reflect-metadata";
import {LocalDatabaseService} from "../shared/localDatabaseService";
var Sqlite = require("nativescript-sqlite");

QUnit.test("initialiseDatabaseIfNotExists creates database if not present", function (assert) {
    assert.expect(1);
    var databaseName = "testBackOnTrack.db";
    //If the database exists, delete it so multiple tests won't affect each other
    if (Sqlite.exists(databaseName)){
        Sqlite.deleteDatabase(databaseName);
    }
    
    var target = new LocalDatabaseService("testBackOnTrack.db");
    var promise = target.initialiseDatabaseIfNotExists();

    //Database should exist
    return promise.then(x=> assert.equal(true, Sqlite.exists(databaseName)));
});

QUnit.test("initialiseDatabaseIfNotExists creates tables if not present", function (assert) {
    assert.expect(5);
    var databaseName = "testBackOnTrack.db";
    //If the database exists, delete it so multiple tests won't affect each other
    if (Sqlite.exists(databaseName)){
        Sqlite.deleteDatabase(databaseName);
    }
    
    var target = new LocalDatabaseService("testBackOnTrack.db");
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