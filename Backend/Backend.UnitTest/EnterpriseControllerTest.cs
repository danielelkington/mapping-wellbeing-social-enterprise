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
            _fakeContext.EnterpriseList.Add(new Enterprise { EnterpriseId = "1", EnterpriseName = "Enterprise1" });
            _fakeContext.EnterpriseList.Add(new Enterprise { EnterpriseId = "2", EnterpriseName = "Enterprise2" });

            //Act
            var response = _target.Get().ToList();

            //Assert
            response.Count.Should().Be(2);
            response[0].Should().Be("Enterprise1");
            response[1].Should().Be("Enterprise2");
        }

        [TestMethod]
        public void GetEnterprise_ReturnsSingleEnterprise()
        {
            var response = _target.Get(1);
            response.Should().Be("ForestedgeCommunityGarden");
        }
    }
}
