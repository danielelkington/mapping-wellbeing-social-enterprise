using Backend.WebServices.DatabaseEntities;

namespace Backend.WebServices.DataTransferObjects
{
    public class PathPointDTO
    {
        public PathPointDTO(PathPoint place)
        {
            Id = place.Id;
            ParticipantId = place.ParticipantId;
            SequenceNumber = place.SequenceNumber;
            Latitude = place.Latitude;
            Longitude = place.Longitude;
        }

        public int Id { get; set; }
        public int ParticipantId { get; set; }
        public int SequenceNumber { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }
}