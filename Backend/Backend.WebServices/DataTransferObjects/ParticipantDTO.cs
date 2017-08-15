using Backend.WebServices.DatabaseEntities;
using System.Collections.Generic;

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
            Enterprise = participant.Enterprise;
            Places = participant.Places;    
        }

        public int Id { get; set; }
        public int EnterpriseId { get; set; }
        public string ParticipantName { get; set; }
        public string Bio { get; set; }
        public string ImageUrl { get; set; }
        public virtual Enterprise Enterprise { get; set; }
        public virtual ICollection<Place> Places { get; set; }
}
}