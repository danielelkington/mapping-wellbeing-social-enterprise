using Backend.WebServices.DatabaseEntities;
using System.Collections.Generic;

namespace Backend.WebServices.DataTransferObjects
{
    public class MediaItemTypeDTO
    {
        public MediaItemTypeDTO(MediaItemType mediaItemType)
        {
            Id = mediaItemType.Id;
            Name = mediaItemType.Name;
            MediaItems = mediaItemType.MediaItems;
        } 

        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<MediaItem> MediaItems { get; set; }
    }
}