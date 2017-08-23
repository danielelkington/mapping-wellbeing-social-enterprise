insert into Enterprise(Name, Password, CoverImageURL, CoverCoordinate, ModifiedUTC) 
	values ('Lilydale', NULL, 'https://i.imgur.com/7gX1F3d.png', geography::Point(-37.756277, 145.347447, 4326), GETUTCDATE());  
insert into Enterprise(Name, Password, CoverImageURL, CoverCoordinate, ModifiedUTC) 
	values ('Hawthorn', '1234', 'https://i.imgur.com/7gX1F3d.png', geography::Point(-37.822603, 145.035383, 4326), GETUTCDATE());  

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

insert into MediaItem(PlaceId, MediaItemTypeId, Name, Filename, URL)
	values ((select Id from Place where SequenceNumber = 1), (select Id from MediaItemType where Name = 'Image'), 'House', '', '');
insert into MediaItem(PlaceId, MediaItemTypeId, Name, Filename, URL)
	values ((select Id from Place where SequenceNumber = 2), (select Id from MediaItemType where Name = 'Image'), 'School', '', '');
insert into MediaItem(PlaceId, MediaItemTypeId, Name, Filename, URL)
	values ((select Id from Place where SequenceNumber = 3), (select Id from MediaItemType where Name = 'Video'), 'Work', '', '');