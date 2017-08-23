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
            ImageUrl = participant.ImageURL;
            ImageFilename = participant.ImageFilename;
            Places = participant.Places.Select(x => new PlaceDTO(x)).ToList();    
        }

        public int Id { get; set; }
        public int EnterpriseId { get; set; }
        public string Name { get; set; }
        public string Bio { get; set; }
        public string ImageUrl { get; set; }
        public string ImageFilename { get; set; }
        public virtual ICollection<PlaceDTO> Places { get; set; }
}
}