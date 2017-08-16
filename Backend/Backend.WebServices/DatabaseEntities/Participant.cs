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

        public int Id { get; set; }

        public int EnterpriseId { get; set; }

        [StringLength(255)]
        public string Name { get; set; }

        public string Bio { get; set; }

        [StringLength(255)]
        public string ImageFilename { get; set; }

        public string ImageURL { get; set; }

        public virtual Enterprise Enterprise { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Place> Places { get; set; }
    }
}
