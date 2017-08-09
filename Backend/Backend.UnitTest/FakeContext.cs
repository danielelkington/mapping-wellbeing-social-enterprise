using Backend.WebServices.DatabaseEntities;
using Moq;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Backend.UnitTest
{
    public class FakeContext : IContext
    {
        /// <summary>
        /// Mock a Dbset based on a list
        /// </summary>
        private DbSet<T> GetQueryableMockDbSet<T>(List<T> sourceList) where T: class
        {
            var queryable = sourceList.AsQueryable();
            var dbSet = new Mock<DbSet<T>>();
            dbSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(queryable.Provider);
            dbSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
            dbSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
            dbSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(() => queryable.GetEnumerator());

            return dbSet.Object;
        }

        public FakeContext()
        {
            Enterprises = GetQueryableMockDbSet(EnterpriseList);
            MediaItems = GetQueryableMockDbSet(MediaItemsList);
            MediaItemTypes = GetQueryableMockDbSet(MediaItemTypeList);
            Participants = GetQueryableMockDbSet(ParticipantList);
            Places = GetQueryableMockDbSet(PlaceList);
        }

        //Modify these properties to mock what's in the 'database' in tests
        public List<Enterprise> EnterpriseList { get; } = new List<Enterprise>();
        public List<MediaItem> MediaItemsList { get; } = new List<MediaItem>();
        public List<MediaItemType> MediaItemTypeList { get; } = new List<MediaItemType>();
        public List<Participant> ParticipantList { get; } = new List<Participant>();
        public List<Place> PlaceList { get; } = new List<Place>();

        //Best not to directly interact with these directly in tests
        public DbSet<Enterprise> Enterprises { get; }
        public DbSet<MediaItem> MediaItems { get; }
        public DbSet<MediaItemType> MediaItemTypes { get; }
        public DbSet<Participant> Participants { get; }
        public DbSet<Place> Places { get;  }
    }
}
