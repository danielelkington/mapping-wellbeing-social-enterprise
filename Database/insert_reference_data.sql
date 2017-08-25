insert into Enterprise(Name, Password, CoverImageURL, CoverImageFilename, CoverCoordinate, ModifiedUTC) 
	values ('Lilydale', NULL, 'https://backontrack.blob.core.windows.net/blobs/512e154d-10b7-4598-abff-73f1abc27d13.jpg', '512e154d-10b7-4598-abff-73f1abc27d13.jpg', geography::Point(-37.756277, 145.347447, 4326), GETUTCDATE());  
insert into Enterprise(Name, Password, CoverImageURL, CoverImageFilename, CoverCoordinate, ModifiedUTC) 
	values ('Hawthorn', '1234', 'https://backontrack.blob.core.windows.net/blobs/aa4da771-b20b-48f8-93ca-2b38fe5c0ff1.png', 'aa4da771-b20b-48f8-93ca-2b38fe5c0ff1.png', geography::Point(-37.822603, 145.035383, 4326), GETUTCDATE());  

insert into Participant(EnterpriseId, Name, Bio, ImageURL, ImageFilename) 
	values ((select Id from Enterprise where Name = 'Lilydale'), 'John', 'John is a builder.', '', '');   
insert into Participant(EnterpriseId, Name, Bio, ImageURL, ImageFilename) 
	values ((select Id from Enterprise where Name = 'Lilydale'), 'Jess', 'Jess is back on her own again', '', '');
insert into Participant(EnterpriseId, Name, Bio, ImageURL, ImageFilename) 
	values ((select Id from Enterprise where Name = 'Hawthorn'), 'Bill', 'Bill is happier with his life now', '', '');  
insert into Participant(EnterpriseId, Name, Bio, ImageURL, ImageFilename) 
	values ((select Id from Enterprise where Name = 'Hawthorn'), 'Sarah', 'Has dreams to making it big.', '', ''); 

insert into Place(ParticipantId, SequenceNumber, Name, Coordinate, Description)
	values ((select Id from Participant where Name = 'John'), 1, 'Home', geography::Point(-38.8046, 144.9834, 4326), 'Where he grew up');
insert into Place(ParticipantId, SequenceNumber, Name, Coordinate, Description)
	values ((select Id from Participant where Name = 'John'), 2, 'School', geography::Point(-38.8049, 144.9835, 4326), 'Met some dodgey friends');
insert into Place(ParticipantId, SequenceNumber, Name, Coordinate, Description)
	values ((select Id from Participant where Name = 'John'), 3, 'Work', geography::Point(-38.8043, 144.9836, 4326), 'Working har to pay bills');

insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)
	values ((select Id from Participant where Name = 'John'), 1, -38.8046, 144.9834);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)
	values ((select Id from Participant where Name = 'John'), 2, -38.8047, 144.9840);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)
	values ((select Id from Participant where Name = 'John'), 3, -38.8049, 144.9835);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)
	values ((select Id from Participant where Name = 'Jess'), 1, -38.8047, 144.9840);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)
	values ((select Id from Participant where Name = 'Jess'), 2, -38.8047, 144.9840);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)
	values ((select Id from Participant where Name = 'Jess'), 3, -38.8049, 144.9835);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)
	values ((select Id from Participant where Name = 'Sarah'), 1, -38.8047, 144.9840);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)
	values ((select Id from Participant where Name = 'Sarah'), 2, -38.8047, 144.9840);
insert into PathPoint(ParticipantId, SequenceNumber, Latitude, Longitude)
	values ((select Id from Participant where Name = 'Sarah'), 3, -38.8046, 144.9830);

insert into MediaItem(PlaceId, MediaItemTypeId, Name, Filename, URL)
	values ((select Id from Place where SequenceNumber = 1), (select Id from MediaItemType where Name = 'Image'), 'House', 'f0103c37-5ae9-4d43-bf66-4c07d751214e.png', 'https://backontrack.blob.core.windows.net/blobs/f0103c37-5ae9-4d43-bf66-4c07d751214e.png');
insert into MediaItem(PlaceId, MediaItemTypeId, Name, Filename, URL)
	values ((select Id from Place where SequenceNumber = 2), (select Id from MediaItemType where Name = 'Image'), 'School', 'c640bb79-8a62-440c-bbe6-0b46e498d674.jpg', 'https://backontrack.blob.core.windows.net/blobs/c640bb79-8a62-440c-bbe6-0b46e498d674.jpg');
insert into MediaItem(PlaceId, MediaItemTypeId, Name, Filename, URL)
	values ((select Id from Place where SequenceNumber = 3), (select Id from MediaItemType where Name = 'Video'), 'Work', '9640688a-591a-43e1-8ff7-9da7d82f650d.jpeg', 'https://backontrack.blob.core.windows.net/blobs/9640688a-591a-43e1-8ff7-9da7d82f650d.jpeg');