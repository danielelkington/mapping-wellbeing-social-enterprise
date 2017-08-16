using Backend.WebServices.DatabaseEntities;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;

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
            MediaItems = place.MediaItems.Select(x => new MediaItemDTO(x)).ToList();
        }

        public int PlaceID { get; set; }
        public int ParticipantId { get; set; }
        public int SequenceNumber { get; set; }
        public string Name { get; set; }
        public DbGeography Coordinate { get; set; }
        public virtual ICollection<MediaItemDTO> MediaItems { get; set; }
    }
}