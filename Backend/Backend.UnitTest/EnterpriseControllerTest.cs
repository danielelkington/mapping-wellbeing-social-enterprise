using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.WebServices.Controllers;
using FluentAssertions;
using System.Linq;
using Backend.WebServices.DatabaseEntities;
using System.Collections.Generic;
using System.Net.Http;
using System.Web;

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
            //Arrange                           --Is there an easier way?
            MediaItemType mediaItemType = new MediaItemType { Id = 25, Name = "newMediaItemType" };
            MediaItem mediaItem = new MediaItem { Id = 20, Name = "newMediaItem", PlaceId = 15, MediaItemType = mediaItemType };
            Place place = new Place { Id = 15, Name = "newPlace", ParticipantId = 10, MediaItems = new List<MediaItem>() { mediaItem } };
            Participant participant = new Participant { Id = 10, Name = "newParticipant", EnterpriseId = 5, Places = new List<Place>() { place } };
            Enterprise enterprise = new Enterprise { Id = 5, Name = "Enterprise1", Password = "abc", CoverImageURL = "myimage.com", ModifiedUTC = 2, Participants = new List<Participant>() { participant } };

            _fakeContext.EnterpriseList.Add(enterprise);

            _target.Request = new HttpRequestMessage();
            _target.Request.Headers.Add("Authorization", "abc");

            //Act
             var response = _target.Get(5);
            
            //Assert
            response.Participants.First()
                    .Places.First()
                    .MediaItems.First()
                    .MediaItemType.Name.Should().Be("newMediaItemType");
        }

        [TestMethod]
        public void GetEnterprise_ReturnError403()
        {
            //Arrange
            Enterprise enterprise = new Enterprise { Id = 5, Name = "Enterprise1", Password = "abc", CoverImageURL = "myimage.com", ModifiedUTC = 2 };

            _fakeContext.EnterpriseList.Add(enterprise);

            _target.Request = new HttpRequestMessage();
            _target.Request.Headers.Add("Authorization", "wrongPassword");

            //Act
            try
            {
                var response = _target.Get(5);
                Assert.Fail();
            }

            //Assert
            catch (HttpException ex)
            {
                Assert.AreEqual(403, ex.GetHttpCode());
            }
        }

        [TestMethod]
        public void GetEnterprise_ReturnError404()
        {
            //Arrange
            _target.Request = new HttpRequestMessage();
            _target.Request.Headers.Add("Authorization", "wrongPassword");

            //Act
            try
            {
                var response = _target.Get(5);
                Assert.Fail();
            }

            //Assert
            catch (HttpException ex)
            {
                Assert.AreEqual(404, ex.GetHttpCode());
            }
        }
    }
}
