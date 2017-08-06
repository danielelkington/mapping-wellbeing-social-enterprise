namespace Backend.WebServices.DatabaseEntities
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Place")]
    public partial class Place
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Place()
        {
            MediaItems = new HashSet<MediaItem>();
        }

        [StringLength(50)]
        public string PlaceId { get; set; }

        [StringLength(50)]
        public string ParticipantId { get; set; }

        [StringLength(50)]
        public string PlaceSquenceNumber { get; set; }

        [StringLength(50)]
        public string PlaceName { get; set; }

        public double? PlaceCoordinate { get; set; }

        [StringLength(50)]
        public string PlaceDescription { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<MediaItem> MediaItems { get; set; }

        public virtual Participant Participant { get; set; }
    }
}
