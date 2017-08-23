using Microsoft.VisualStudio.TestTools.UnitTesting;
using FluentAssertions;
using System;
using Backend.WebServices;

namespace Backend.UnitTest
{
    [TestClass]
    public class ExtensionsTest
    {
        [TestMethod]
        public void UTCDateToUnixTimestamp_ConvertsDateTimeUTCKindToUnixTimestamp()
        {
            var utcDateTime = new DateTime(2017, 8, 19, 2, 38, 31, DateTimeKind.Utc);
            utcDateTime.UTCDateToUnixTimestamp().Should().Be(1503110311);
        }

        [TestMethod]
        public void UTCDateToUnixTimestamp_ConvertsDateTimeLocalKindToUnixTimestamp()
        {
            var utcDateTime = new DateTime(2017, 8, 19, 2, 38, 31, DateTimeKind.Local);
            utcDateTime.UTCDateToUnixTimestamp().Should().Be(1503110311);
        }

        [TestMethod]
        public void UTCDateToUnixTimestamp_ConvertsDateTimeUnspecifiedKindToUnixTimestamp()
        {
            var utcDateTime = new DateTime(2017, 8, 19, 2, 38, 31, DateTimeKind.Unspecified);
            utcDateTime.UTCDateToUnixTimestamp().Should().Be(1503110311);
        }
    }
}
