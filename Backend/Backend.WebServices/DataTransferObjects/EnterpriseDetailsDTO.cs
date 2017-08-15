using Backend.WebServices.DatabaseEntities;
using System.Collections.Generic;
using System.Data.Entity.Spatial;


namespace Backend.WebServices.DataTransferObjects
{
    public class EnterpriseDetailsDTO
    {
        public EnterpriseDetailsDTO(DatabaseEntities.Enterprise enterprise)
        {
            Id = enterprise.Id;
            Name = enterprise.Name;
            //Password = enterprise.Password;
            CoverImage = enterprise.CoverImageURL;
            CoverCoordinate = enterprise.CoverCoordinate;
            ModifiedUTC = enterprise.ModifiedUTC;
            Participants = enterprise.Participants;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        //public string Password { get; set; }
        public string CoverImage { get; set; }
        public DbGeography CoverCoordinate { get; set; }
        public int? ModifiedUTC { get; set; }
        public ICollection<Participant> Participants { get; set; }
    }
}