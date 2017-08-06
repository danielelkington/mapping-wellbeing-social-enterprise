using System.Data.Entity;

namespace Backend.WebServices.DatabaseEntities
{
    public interface IContext
    {
        DbSet<Enterprise> Enterprises { get; set; }
        DbSet<MediaItem> MediaItems { get; set; }
        DbSet<MediaItemType> MediaItemTypes { get; set; }
        DbSet<Participant> Participants { get; set; }
        DbSet<Place> Places { get; set; }
    }
}
