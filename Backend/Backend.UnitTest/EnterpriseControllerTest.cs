﻿using Microsoft.VisualStudio.TestTools.UnitTesting;
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
            //Arrange                           --Is there an easier way?
            MediaItemType mediaItemType = new MediaItemType { Id = 25, Name = "newMediaItemType" };
            MediaItem mediaItem = new MediaItem { Id = 20, Name = "newMediaItem", PlaceId = 15, MediaItemType = mediaItemType };
            Place place = new Place { PlaceId = 15, Name = "newPlace", ParticipantId = 10, MediaItems = new List<MediaItem>() { mediaItem } };
            Participant participant = new Participant { Id = 10, ParticipantName = "newParticipant", EnterpriseId = 5, Places = new List<Place>() { place } };
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
            }

            //Assert
            catch (HttpException ex)
            {
                Assert.AreEqual(404, ex.GetHttpCode());
            }
        }
    }
}
