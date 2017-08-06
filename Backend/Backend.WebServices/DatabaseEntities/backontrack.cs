namespace Backend.WebServices.DatabaseEntities
{
    using System.Data.Entity;

    public partial class backontrack : DbContext
    {
        public backontrack()
            : base("name=backontrack")
        {
        }

        public virtual DbSet<Enterprise> Enterprises { get; set; }
        public virtual DbSet<MediaItem> MediaItems { get; set; }
        public virtual DbSet<MediaItemType> MediaItemTypes { get; set; }
        public virtual DbSet<Participant> Participants { get; set; }
        public virtual DbSet<Place> Places { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}
