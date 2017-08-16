﻿using Backend.WebServices.DatabaseEntities;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;


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
            Participants = enterprise.Participants.Select(x => new ParticipantDTO(x)).ToList();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        //public string Password { get; set; }
        public string CoverImage { get; set; }
        public DbGeography CoverCoordinate { get; set; }
        public int? ModifiedUTC { get; set; }
        public virtual ICollection<ParticipantDTO> Participants { get; set; }
    }
}