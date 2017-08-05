// A sample QUnit test

/*QUnit.test("equal test", function (assert) {
  assert.equal( 0, 0, "Zero, Zero; equal succeeds" );
  assert.equal( "", 0, "Empty, Zero; equal succeeds" );
  assert.equal( "", "", "Empty, Empty; equal succeeds" );
  assert.equal( 0, false, "Zero, false; equal succeeds" );
});*/

var participants = require("../pages/enterprises/participants.js");						//Access Participant variables and functions
var newParticipant = new participants.Participant("Jim");
QUnit.test("Participant Test", function (assert) {
    assert.equal( newParticipant.strName, "Jim", "Participant's name is indeed Jim" ); 	//Assert that the participant's name is Jim.
});


var participant1 = new participants.Participant("Ben10");
var participant2 = new participants.Participant("Kevin11");
var participant3 = new participants.Participant("Bob12");
var participantList = [participant1, participant2, participant3];
var enterprises = require("../pages/enterprises/enterprise.js");
var newEnterprise = new enterprises.Enterprise(1, "Fred's Enterprise", participantList, null, null);

QUnit.test("Enterprise Test", function (assert) {
    assert.equal( newEnterprise.strName, "Fred's Enterprise", "This Enterprise indeed Fred's" ); 			//Assert that the enterprise's is Fred's Enterprise.
    assert.notEqual( newEnterprise.strName, "Jim's Enterprise", "This Enterprise indeed Fred's" ); 			//Assert that the enterprise's is not Jim's Enterprise.
    assert.equal( newEnterprise.hasPassword(), false, "There is no password set" );							//Assert that the enterprise's is not password protected.
    assert.ok( newEnterprise.pplParticipantList.length == 3, "There are 3 members in this enterprise" );	//Assert that there are indeed 3 participants in this enterprise.
	assert.notEqual( newEnterprise.getParticipant("Ben10"), null, "Ben 10 is in this enterprise" );			//Assert that Ben10 is a participant that is in this enterprise. THIS FAILS FOR SOME REASON! :/
	assert.equal( newEnterprise.getParticipant("Bob11"), null, "Bob12 is not in this enterprise" );			//Assert that Bob11 is not in this enterprise.
});