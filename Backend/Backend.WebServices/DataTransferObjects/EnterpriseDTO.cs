using System;

namespace Backend.WebServices.DataTransferObjects
{
    /// <summary>
    /// A basic summary of an enterprise to be used for a list of enterprises
    /// </summary>
    public class EnterpriseDTO
    {
        public EnterpriseDTO(DatabaseEntities.Enterprise enterprise)
        {
            Id = enterprise.Id;
            Name = enterprise.Name;
            HasPassword = enterprise.Password != null;
            CoverImageURL = enterprise.CoverImageURL;
            ModifiedUTC = enterprise.ModifiedUTC.UTCDateToUnixTimestamp();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool HasPassword { get; set; }
        public string CoverImageURL { get; set; }
        public long ModifiedUTC { get; set; }
    }
}