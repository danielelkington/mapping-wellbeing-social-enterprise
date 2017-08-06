namespace Backend.WebServices.DatabaseEntities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("MediaItem")]
    public partial class MediaItem
    {
        [StringLength(50)]
        public string MediaItemId { get; set; }

        [StringLength(50)]
        public string PlaceId { get; set; }

        [StringLength(50)]
        public string MediaItemTypeId { get; set; }

        [StringLength(50)]
        public string MediaItemName { get; set; }

        [StringLength(50)]
        public string MediaItemURL { get; set; }

        public virtual MediaItemType MediaItemType { get; set; }

        public virtual Place Place { get; set; }
    }
}
