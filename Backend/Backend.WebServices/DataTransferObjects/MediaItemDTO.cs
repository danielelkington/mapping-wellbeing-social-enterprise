using Backend.WebServices.DatabaseEntities;
using System.Collections.Generic;

namespace Backend.WebServices.DataTransferObjects
{
    public class MediaItemDTO
    {
        public MediaItemDTO(MediaItem mediaItem)
        {
            Id = mediaItem.Id;
            PlaceId = mediaItem.PlaceId;
            MediaTypeById = mediaItem.MediaItemTypeId;
            Name = mediaItem.Name;
            URL = mediaItem.URL;
            Filename = mediaItem.Filename;
            MediaItemType = new MediaItemTypeDTO(mediaItem.MediaItemType);
        }

        public int Id { get; set; }
        public int PlaceId { get; set; }
        public int MediaTypeById { get; set; }
        public string Name { get; set; }
        public string Filename { get; set; }
        public string URL { get; set; }
        public virtual MediaItemTypeDTO MediaItemType { get; set; }
    }
}