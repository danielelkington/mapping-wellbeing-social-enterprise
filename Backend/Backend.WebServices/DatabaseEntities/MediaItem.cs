namespace Backend.WebServices.DatabaseEntities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("MediaItem")]
    public partial class MediaItem
    {
        public int Id { get; set; }

        public int PlaceId { get; set; }

        public int MediaItemTypeId { get; set; }

        [StringLength(255)]
        public string Name { get; set; }

        [StringLength(255)]
        public string URL { get; set; }

        public virtual MediaItemType MediaItemType { get; set; }

        public virtual Place Place { get; set; }
    }
}
