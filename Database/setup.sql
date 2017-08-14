IF OBJECT_ID('dbo.MediaItem', 'U') IS NOT NULL
	DROP TABLE MediaItem;

IF OBJECT_ID('dbo.MediaItemType', 'U') IS NOT NULL
	DROP TABLE MediaItemType;

IF OBJECT_ID('dbo.Place', 'U') IS NOT NULL
	DROP TABLE Place;

IF OBJECT_ID('dbo.Participant', 'U') IS NOT NULL
	DROP TABLE Participant;

IF OBJECT_ID('dbo.Enterprise', 'U') IS NOT NULL
	DROP TABLE Enterprise;

CREATE TABLE Enterprise (
	[Id] int NOT NULL IDENTITY(1,1) PRIMARY KEY,
	[Name] nvarchar(255) NOT NULL, 
	[Password] nvarchar(255), 
	[CoverImageURL] nvarchar(255), 
	[CoverCoordinate] geography,
	[ModifiedUTC] int
);

CREATE TABLE Participant (
	[Id] int NOT NULL IDENTITY(1,1) PRIMARY KEY,
	[EnterpriseId] int NOT NULL,
	[Name] nvarchar(255) NOT NULL,
	[Bio] nvarchar(max),
	[ImageURL] nvarchar(255),
	FOREIGN KEY (EnterpriseId) REFERENCES Enterprise(Id)
);

CREATE TABLE Place (
	[Id] int NOT NULL IDENTITY(1,1) PRIMARY KEY,
	[ParticipantId] int NOT NULL, 
	[SequenceNumber] int NOT NULL,
	[Name] nvarchar(255),
	[Coordinate] geography,
	[Description] nvarchar(max),
	FOREIGN KEY (ParticipantId) REFERENCES Participant(Id)
);

CREATE TABLE MediaItemType (
	[Id] int NOT NULL IDENTITY(1,1) PRIMARY KEY,
	[Name] nvarchar(50)
); 

CREATE TABLE MediaItem (
	[Id] int NOT NULL IDENTITY(1,1) PRIMARY KEY,
	[PlaceId] int,
	[MediaItemTypeId] int,
	[Name] nvarchar(255),
	[URL] nvarchar(255),
	FOREIGN KEY (PlaceId) REFERENCES Place(Id),
	FOREIGN KEY (MediaItemTypeId) REFERENCES MediaItemType(Id)
); 