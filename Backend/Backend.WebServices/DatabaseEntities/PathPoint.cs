namespace Backend.WebServices.DatabaseEntities
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("PathPoint")]
    public partial class PathPoint
    {
        public int Id { get; set; }

        public int ParticipantId { get; set; }

        public int SequenceNumber { get; set; }

        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }

        public virtual Participant Participant { get; set; }
    }
}
