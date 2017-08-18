using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.WebServices.Controllers;
using FluentAssertions;
using System.Linq;

namespace Backend.UnitTest
{
    [TestClass]
    public class EnterpriseControllerTest
    {
        private EnterpriseController _target;

        [TestInitialize]
        public void Setup()
        {
            _target = new EnterpriseController();
        }

        [TestMethod]
        public void GetAllEnterprises_ReturnsAllEnterprises()
        {
            var response = _target.Get().ToList();
            response.Count.Should().Be(2);
            response[0].Should().Be("ForestedgeCommunityGarden");
            response[1].Should().Be("VolunteerZoo");
        }

        [TestMethod]
        public void GetEnterprise_ReturnsSingleEnterprise()
        {
            var response = _target.Get(1);
            response.Should().Be("ForestedgeCommunityGarden");
        }
    }
}
