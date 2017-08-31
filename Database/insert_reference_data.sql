insert into Enterprise(Name, Password, CoverImageURL, CoverImageFilename, ModifiedUTC) 
	values ('Lilydale', NULL, 'https://backontrack.blob.core.windows.net/blobs/512e154d-10b7-4598-abff-73f1abc27d13.jpg', '512e154d-10b7-4598-abff-73f1abc27d13.jpg', GETUTCDATE());  
insert into Enterprise(Name, Password, CoverImageURL, CoverImageFilename, ModifiedUTC) 
	values ('Hawthorn', '1234', 'https://backontrack.blob.core.windows.net/blobs/aa4da771-b20b-48f8-93ca-2b38fe5c0ff1.png', 'aa4da771-b20b-48f8-93ca-2b38fe5c0ff1.png', GETUTCDATE());  

insert into Participant(EnterpriseId, Name, Bio) 
	values ((select Id from Enterprise where Name = 'Lilydale'), 'John', 'John is a builder.');   
insert into Participant(EnterpriseId, Name, Bio) 
	values ((select Id from Enterprise where Name = 'Lilydale'), 'Jess', 'Jess is back on her own again');
insert into Participant(EnterpriseId, Name, Bio) 
	values ((select Id from Enterprise where Name = 'Hawthorn'), 'Bill', 'Bill is happier with his life now');  
insert into Participant(EnterpriseId, Name, Bio) 
	values ((select Id from Enterprise where Name = 'Hawthorn'), 'Sarah', 'Has dreams to making it big.'); 

insert into Place(ParticipantId, SequenceNumber, Name, Latitude, Longitude, Description)
	values ((select Id from Participant where Name = 'John'), 1, 'Home', -37.821628, 145.036412, 'Where he grew up');
insert into Place(ParticipantId, SequenceNumber, Name, Latitude, Longitude, Description)
	values ((select Id from Participant where Name = 'John'), 2, 'School', -37.822437, 145.038436, 'Met some dodgey friends');
insert into Place(ParticipantId, SequenceNumber, Name, Latitude, Longitude, Description)
	values ((select Id from Participant where Name = 'John'), 3, 'Work', -37.821470, 145.039103, 'Working hard to pay bills');

insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'John'), 1, -37.821690, 145.036450);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'John'), 2, -37.821752, 145.037308);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'John'), 3, -37.821769, 145.038105);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'John'), 4, -37.822031, 145.038175);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'John'), 5, -37.822207, 145.037944);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'John'), 6, -37.822360, 145.038046);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'John'), 7, -37.822379, 145.038427);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'John'), 8, -37.822466, 145.038907);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'John'), 9, -37.822226, 145.039003);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'John'), 10, -37.822224, 145.039304);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'John'), 11, -37.822366, 145.039221);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Jess'), 1, -37.821690, 145.036450);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Jess'), 2, -37.821752, 145.037308);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Jess'), 3, -37.821769, 145.038105);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Jess'), 4, -37.821889, 145.039017);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Jess'), 5, -37.821163, 145.039151);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Jess'), 6, -37.820983, 145.039194);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Jess'), 7, -37.821023, 145.039352);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Jess'), 8, -37.820546, 145.039408);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Sarah'), 1, -37.821690, 145.036450);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Sarah'), 2, -37.821752, 145.037308);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Sarah'), 3, -37.821769, 145.038105);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Sarah'), 4, -37.821889, 145.039017);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Sarah'), 5, -37.822226, 145.039003);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Sarah'), 6, -37.822466, 145.038907);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)	
	values ((select Id from Participant where Name = 'Sarah'), 7, -37.821470, 145.039103);

insert into MediaItem(PlaceId, MediaItemTypeId, Name, Filename, URL)
	values ((select Id from Place where SequenceNumber = 1), (select Id from MediaItemType where Name = 'Image'), 'House', 'f0103c37-5ae9-4d43-bf66-4c07d751214e.png', 'https://backontrack.blob.core.windows.net/blobs/f0103c37-5ae9-4d43-bf66-4c07d751214e.png');
insert into MediaItem(PlaceId, MediaItemTypeId, Name, Filename, URL)
	values ((select Id from Place where SequenceNumber = 2), (select Id from MediaItemType where Name = 'Image'), 'School', 'c640bb79-8a62-440c-bbe6-0b46e498d674.jpg', 'https://backontrack.blob.core.windows.net/blobs/c640bb79-8a62-440c-bbe6-0b46e498d674.jpg');
insert into MediaItem(PlaceId, MediaItemTypeId, Name, Filename, URL)
	values ((select Id from Place where SequenceNumber = 3), (select Id from MediaItemType where Name = 'Video'), 'Work', '9640688a-591a-43e1-8ff7-9da7d82f650d.jpeg', 'https://backontrack.blob.core.windows.net/blobs/9640688a-591a-43e1-8ff7-9da7d82f650d.jpeg');
