using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.WebServices.Controllers;
using FluentAssertions;
using System.Linq;
using Backend.WebServices.DatabaseEntities;

namespace Backend.UnitTest
{
    [TestClass]
    public class EnterpriseControllerTest
    {
        private EnterpriseController _target;
        private FakeContext _fakeContext = new FakeContext();

        [TestInitialize]
        public void Setup()
        {
            _target = new EnterpriseController(_fakeContext);
        }

        [TestMethod]
        public void GetAllEnterprises_ReturnsAllEnterprises()
        {
            //Arrange
            _fakeContext.EnterpriseList.Add(new Enterprise { Id = 1, Name = "Enterprise1", Password = "abc", CoverImageURL = "myimage.com", ModifiedUTC = 2 });
            _fakeContext.EnterpriseList.Add(new Enterprise { Id = 2, Name = "Enterprise2", CoverImageURL = "anotherImage.com", ModifiedUTC = 3 });

            //Act
            var response = _target.Get().ToList();

            //Assert
            response.Count.Should().Be(2);
            var first = response.First();
            first.Id.Should().Be(1);
            first.Name.Should().Be("Enterprise1");
            first.HasPassword.Should().BeTrue();
            first.CoverImageURL.Should().Be("myimage.com");
            first.ModifiedUTC.Should().Be(2);

            var last = response.Last();
            last.Id.Should().Be(2);
            last.HasPassword.Should().BeFalse();
        }

        [TestMethod]
        public void GetEnterprises_ReturnsEnterprisesInAlphabeticalOrderByName()
        {
            //Arrange
            _fakeContext.EnterpriseList.Add(new Enterprise { Name = "d" });
            _fakeContext.EnterpriseList.Add(new Enterprise { Name = "aa" });
            _fakeContext.EnterpriseList.Add(new Enterprise { Name = "a1" });

            //Act
            var response = _target.Get().ToList();

            //Assert
            response[0].Name.Should().Be("a1");
            response[1].Name.Should().Be("aa");
            response[2].Name.Should().Be("d");
        }

        [TestMethod]
        public void GetEnterprise_ReturnsSingleEnterprise()
        {
            //Arrange
            _fakeContext.EnterpriseList.Add(new Enterprise { Id = 5, Name = "Enterprise1", Password = "abc", CoverImageURL = "myimage.com", ModifiedUTC = 2 });

            //Act
            var response = _target.Get(5, "abc");
            
            //Assert
            response.Name.Should().Be("Enterprise1");
        }
    }
}
