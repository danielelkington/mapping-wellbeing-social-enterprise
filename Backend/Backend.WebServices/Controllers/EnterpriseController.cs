
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using System;
using System.Data.Entity;
using Backend.WebServices.DatabaseEntities;
using System.Linq;
using Backend.WebServices.DataTransferObjects;
using System.Net.Http;
using System.Net;

namespace Backend.WebServices.Controllers
{
    public class EnterpriseController : ApiController
    {
        private IContext _context;

        /// <summary>
        /// True if we're debugging, false if deployed to actual backend.
        /// </summary>
        //note: HttpContext.Current is null when running unit tests
        private bool Debugging => HttpContext.Current?.IsDebuggingEnabled ?? true;

        private void ThrowHttpException(HttpStatusCode statusCode, string message)
        {
            var response = new HttpResponseMessage(statusCode)
            {
                Content = new StringContent(message)
            };
            throw new HttpResponseException(response);
        }

        /// <summary>
        /// Because our APIs contain sensitive data, force the client to use HTTPS.
        /// </summary>
        private void ThrowExceptionIfNotHttps()
        {
            if (Debugging)
                return; //don't worry about this if in debug mode.
            if (Request.RequestUri.Scheme != Uri.UriSchemeHttps)
                ThrowHttpException(HttpStatusCode.Forbidden, "Must use https to access this resource, cannot use http");
        }

        public EnterpriseController(IContext context)
        {
            _context = context;
        }

        // GET api/enterprise
        public IEnumerable<EnterpriseDTO> Get()
        {
            ThrowExceptionIfNotHttps();
            var enterprises = _context.Enterprises
                                .OrderBy(x => x.Name)
                                .ToList();

            return enterprises.Select(x => new EnterpriseDTO(x)).ToList();
        }

        // GET api/enterprise/5
        /// <summary>
        /// Given an Id (and possibly a password), get details of a specific enterprise
        /// </summary>
        /// <param name="id">ID of the enterprise whose details will be returned</param>
        /// <param name="password">Password of the enterprise</param>
        /// <returns>An EnterpriseDTO with the specified ID</returns>
        public EnterpriseDetailsDTO Get(int id)
        {
            ThrowExceptionIfNotHttps();
            var enterprise = _context.Enterprises
                                .Where(x => x.Id == id)
                                .Include(x => x.Participants.Select(
                                         p => p.Places.Select(
                                         m => m.MediaItems)))
                                .SingleOrDefault();

            if (enterprise == null)
                ThrowHttpException(HttpStatusCode.NotFound, $"Enterprise not found. The Enterprise with ID: {id} does not exist.");

            if (enterprise.Password != null)
            {
                string password = null;

                if (Request.Headers.Any(x => "Authorization".Equals(x.Key)))
                {
                    password = Request.Headers.GetValues("Authorization").First();

                    if (!password.Equals(enterprise.Password))
                        ThrowHttpException(HttpStatusCode.Forbidden, "That password was incorrect");
                }
                else
                {
                    ThrowHttpException(HttpStatusCode.Forbidden, "No password provided when enterprise is password protected");
                }
            }
            return new EnterpriseDetailsDTO(enterprise);
        }
    }
}
