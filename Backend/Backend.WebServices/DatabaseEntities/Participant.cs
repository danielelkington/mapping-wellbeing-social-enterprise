namespace Backend.WebServices.DatabaseEntities
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Participant")]
    public partial class Participant
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Participant()
        {
            Places = new HashSet<Place>();
        }

        [StringLength(50)]
        public string ParticipantId { get; set; }

        [StringLength(50)]
        public string EnterpriseId { get; set; }

        [StringLength(50)]
        public string ParticipantName { get; set; }

        [StringLength(50)]
        public string ParticipantBio { get; set; }

        [Column(TypeName = "image")]
        public byte[] ParticipantImage { get; set; }

        public virtual Enterprise Enterprise { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Place> Places { get; set; }
    }
}
