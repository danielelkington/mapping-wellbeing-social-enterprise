namespace Backend.WebServices.DatabaseEntities
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("MediaItemType")]
    public partial class MediaItemType
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public MediaItemType()
        {
            MediaItems = new HashSet<MediaItem>();
        }

        [StringLength(50)]
        public string MediaItemTypeId { get; set; }

        [StringLength(50)]
        public string MediaItemTypeName { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<MediaItem> MediaItems { get; set; }
    }
}
