import {Enterprise} from "../shared/enterprise";
import {MediaItemType} from "../shared/mediaItemType";

QUnit.test("EnterpriseFromJSON constructs enterprise from JSON correctly", function (assert) {
  var json = "{"+
      "\"Id\": 1,"+
      "\"Name\": \"Lilydale\","+
      "\"CoverImageURL\": \"google.com\","+
      "\"CoverImageFilename\": \"google\","+
      "\"ModifiedUTC\": 2,"+
      "\"Participants\": ["+
          "{"+
              "\"Id\": 1,"+
              "\"EnterpriseId\": 1,"+
              "\"Name\": \"John\","+
              "\"Bio\": \"John is a builder.\","+
              "\"Places\": ["+
                  "{"+
                      "\"Id\": 1,"+
                      "\"ParticipantId\": 1,"+
                      "\"SequenceNumber\": 1,"+
                      "\"Name\": \"Home\","+
                      "\"Latitude\": -38.1,"+
                      "\"Longitude\": 145.2,"+
                      "\"MediaItems\": ["+
                          "{"+
                              "\"Id\": 1,"+
                              "\"PlaceId\": 1,"+
                              "\"MediaItemTypeId\": 1,"+
                              "\"Name\": \"House\","+
                              "\"Filename\": \"ack.png\","+
                              "\"URL\": \"nytimes.com\""+
                          "}"+
                      "]"+
                  "},"+
                  "{"+
                      "\"Id\": 2,"+
                      "\"ParticipantId\": 1,"+
                      "\"SequenceNumber\": 2,"+
                      "\"Name\": \"School\","+
                      "\"Latitude\": -39.822603,"+
                      "\"Longitude\": 145.035383,"+
                      "\"MediaItems\": ["+
                      "]"+
                  "}"+
              "],"+
              "\"PathPoints\": ["+
                "{"+
                    "\"Id\": 1,"+
                    "\"ParticipantId\": 1,"+
                    "\"SequenceNumber\": 1,"+
                    "\"Latitude\": -2.1,"+
                    "\"Longitude\": 4.1"+
                "},"+
                "{"+
                    "\"Id\": 2,"+
                    "\"ParticipantId\": 1,"+
                    "\"SequenceNumber\": 2,"+
                    "\"Latitude\": -38.8047,"+
                    "\"Longitude\": 144.984"+
                "}"+
            "]"+
          "},"+
          "{"+
              "\"Id\": 2,"+
              "\"EnterpriseId\": 1,"+
              "\"Name\": \"Jess\","+
              "\"Bio\": \"Jess is back on her own again\","+
              "\"Places\": [],"+
              "\"PathPoints\": []"+
          "}"+
      "]"+
  "}";
  
  var enterprise = Enterprise.EnterpriseFromJSON(JSON.parse(json));
  assert.equal(1, enterprise.id);
  assert.equal("Lilydale", enterprise.name);
  assert.equal("google.com", enterprise.imageURL);
  assert.equal("google", enterprise.imageFileName);
  assert.equal(2, enterprise.modifiedUTC);
  assert.equal(2, enterprise.participants.length);

  var participant = enterprise.participants[0];
  assert.equal(1, participant.id);
  assert.equal("John", participant.name);
  assert.equal("John is a builder.", participant.bio);
  assert.equal(2, participant.places.length);
  assert.equal(2, participant.pathPoints.length);

  var place = participant.places[0];
  assert.equal(1, place.id);
  assert.equal(1, place.sequenceNumber);
  assert.equal("Home", place.name);
  assert.equal(-38.1, place.latitude);
  assert.equal(145.2, place.longitude);
  assert.equal(1, place.mediaItems.length);

  var mediaItem = place.mediaItems[0];
  assert.equal(1, mediaItem.id);
  assert.equal(MediaItemType.Image, mediaItem.mediaItemType);
  assert.equal("House", mediaItem.name);
  assert.equal("ack.png", mediaItem.filename);
  assert.equal("nytimes.com", mediaItem.url);

  var pathPoint = participant.pathPoints[0];
  assert.equal(1, pathPoint.id);
  assert.equal(1, pathPoint.sequenceNumber);
  assert.equal(-2.1, pathPoint.latitude);
  assert.equal(4.1, pathPoint.longitude);
});