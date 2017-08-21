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
            MediaItemTypeId = mediaItem.MediaItemTypeId;
            Name = mediaItem.Name;
            URL = mediaItem.URL;
            Filename = mediaItem.Filename;
        }

        public int Id { get; set; }
        public int PlaceId { get; set; }
        public int MediaItemTypeId { get; set; }
        public string Name { get; set; }
        public string Filename { get; set; }
        public string URL { get; set; }
    }
}