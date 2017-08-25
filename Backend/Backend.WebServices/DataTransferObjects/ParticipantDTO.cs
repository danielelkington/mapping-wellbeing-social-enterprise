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
            Name = participant.Name;
            Bio = participant.Bio;
            Places = participant.Places.Select(x => new PlaceDTO(x)).ToList();
            PathPoints = participant.PathPoints.Select(x => new PathPointDTO(x)).ToList();
        }

        public int Id { get; set; }
        public int EnterpriseId { get; set; }
        public string Name { get; set; }
        public string Bio { get; set; }
        public virtual ICollection<PlaceDTO> Places { get; set; }
        public virtual ICollection<PathPointDTO> PathPoints { get; set; }
    }
}