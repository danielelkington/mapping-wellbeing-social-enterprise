using Backend.WebServices.DatabaseEntities;
using System.Collections.Generic;
using System.Data.Entity.Spatial;

namespace Backend.WebServices.DataTransferObjects
{
    public class PlaceDTO
    {
        public PlaceDTO(Place place)
        {
            PlaceID = place.PlaceId;
            ParticipantId = place.ParticipantId;
            SequenceNumber = place.SequenceNumber;
            Name = place.Name;
            Coordinate = place.Coordinate;
            MediaItems = place.MediaItems;
            Participant = place.Participant;

        }

        public int PlaceID { get; set; }
        public int ParticipantId { get; set; }
        public int SequenceNumber { get; set; }
        public string Name { get; set; }
        public DbGeography Coordinate { get; set; }
        public virtual ICollection<MediaItem> MediaItems { get; set; }
        public virtual Participant Participant { get; set; }
    }
}