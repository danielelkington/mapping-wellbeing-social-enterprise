using Backend.WebServices.DatabaseEntities;
using System.Collections.Generic;
using System.Linq;

namespace Backend.WebServices.DataTransferObjects
{
    public class ParticipantDTO
    {
        public ParticipantDTO(Participant participant)
        {
            Id = participant.Id;
            EnterpriseId = participant.EnterpriseId;
            ParticipantName = participant.ParticipantName;
            Bio = participant.Bio;
            ImageUrl = participant.ImageURL;
            Places = participant.Places.Select(x => new PlaceDTO(x)).ToList();    
        }

        public int Id { get; set; }
        public int EnterpriseId { get; set; }
        public string ParticipantName { get; set; }
        public string Bio { get; set; }
        public string ImageUrl { get; set; }
        public virtual ICollection<PlaceDTO> Places { get; set; }
}
}