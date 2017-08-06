
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using System;

namespace Backend.WebServices.Controllers
{
    public class EnterpriseController : ApiController
    {
        /// <summary>
        /// True if we're debugging, false if deployed to actual backend.
        /// </summary>
        //note: HttpContext.Current is null when running unit tests
        private bool Debugging => HttpContext.Current?.IsDebuggingEnabled ?? true;

        /// <summary>
        /// Because our APIs contain sensitive data, force the client to use HTTPS.
        /// </summary>
        private void ThrowExceptionIfNotHttps()
        {
            if (Debugging)
                return; //don't worry about this if in debug mode.
            if (Request.RequestUri.Scheme != Uri.UriSchemeHttps)
                throw new HttpException(403, "Must use https to access this resource, cannot use http");
        }

        // GET api/enterprise
        public IEnumerable<string> Get()
        {
            ThrowExceptionIfNotHttps();
            return new string[] { "ForestedgeCommunityGarden", "VolunteerZoo" };
        }

        // GET api/enterprise/5
        /// <summary>
        /// Given an Id (and possibly a password), get details of a specific enterprise
        /// </summary>
        /// <param name="id">ID of the enterprise whose details will be returned</param>
        /// <returns>A string representing an enterprise</returns>
        public string Get(int id)
        {
            ThrowExceptionIfNotHttps();
            return "ForestedgeCommunityGarden";
        }
    }
}
