﻿using Backend.WebServices.DatabaseEntities;
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
            name = mediaItem.Name;
            URL = mediaItem.URL;
            MediaItemType = mediaItem.MediaItemType;
            Place = mediaItem.Place;
        }

        public int Id { get; set; }
        public int PlaceId { get; set; }
        public int MediaTypeById { get; set; }
        public string name { get; set; }
        public string URL { get; set; }
        public virtual MediaItemType MediaItemType { get; set; }
        public virtual Place Place { get; set; }
    }
}