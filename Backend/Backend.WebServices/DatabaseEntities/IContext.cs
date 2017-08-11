using System.Data.Entity;

namespace Backend.WebServices.DatabaseEntities
{
    public interface IContext
    {
        DbSet<Enterprise> Enterprises { get; }
        DbSet<MediaItem> MediaItems { get; }
        DbSet<MediaItemType> MediaItemTypes { get; }
        DbSet<Participant> Participants { get; }
        DbSet<Place> Places { get; }
    }
}
