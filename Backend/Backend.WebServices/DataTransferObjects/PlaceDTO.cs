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
            Id = place.Id;
            ParticipantId = place.ParticipantId;
            SequenceNumber = place.SequenceNumber;
            Name = place.Name;
            Latitude = place.Coordinate?.Latitude;
            Longitude = place.Coordinate?.Longitude;
            MediaItems = place.MediaItems.Select(x => new MediaItemDTO(x)).ToList();
        }

        public int Id { get; set; }
        public int ParticipantId { get; set; }
        public int SequenceNumber { get; set; }
        public string Name { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public virtual ICollection<MediaItemDTO> MediaItems { get; set; }
    }
}