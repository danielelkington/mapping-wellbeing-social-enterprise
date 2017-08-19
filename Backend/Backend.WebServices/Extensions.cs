using System;

namespace Backend.WebServices
{
    public static class Extensions
    {
        public static long UTCDateToUnixTimestamp(this DateTime utcDateTime)
        {
            var temp = DateTime.SpecifyKind(utcDateTime, DateTimeKind.Unspecified);
            return new DateTimeOffset(temp, TimeSpan.Zero).ToUnixTimeSeconds();
        }
    }
}