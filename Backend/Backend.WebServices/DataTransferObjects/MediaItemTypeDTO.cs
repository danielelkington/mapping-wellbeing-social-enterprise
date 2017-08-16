using Backend.WebServices.DatabaseEntities;
using System.Collections.Generic;
using System.Linq;

namespace Backend.WebServices.DataTransferObjects
{
    public class MediaItemTypeDTO
    {
        public MediaItemTypeDTO(MediaItemType mediaItemType)
        {
            Id = mediaItemType.Id;
            Name = mediaItemType.Name;
            MediaItems = mediaItemType.MediaItems.Select(x => new MediaItemDTO(x)).ToList();
        } 

        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<MediaItemDTO> MediaItems { get; set; }
    }
}