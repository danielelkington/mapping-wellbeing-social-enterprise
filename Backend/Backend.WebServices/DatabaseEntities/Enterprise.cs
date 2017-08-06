namespace Backend.WebServices.DatabaseEntities
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Enterprise")]
    public partial class Enterprise
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Enterprise()
        {
            Participants = new HashSet<Participant>();
        }

        [StringLength(50)]
        public string EnterpriseId { get; set; }

        [StringLength(50)]
        public string EnterpriseName { get; set; }

        [StringLength(50)]
        public string EnterprisePassword { get; set; }

        [Column(TypeName = "image")]
        public byte[] EnterpriseCoverImage { get; set; }

        public double? EnterpriseCoverCoordinate { get; set; }

        [StringLength(50)]
        public string EnterpriseModifiedUTC { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Participant> Participants { get; set; }
    }
}
