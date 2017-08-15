
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using System;
using System.Data.Entity;
using Backend.WebServices.DatabaseEntities;
using System.Linq;
using Backend.WebServices.DataTransferObjects;

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
                                         m => m.MediaItems.Select(
                                         t => t.MediaItemType))))
                                .SingleOrDefault();

            if (enterprise == null)
                throw new HttpException(404, "Enterprise not found. The Enterprise with ID: " + id + " does not exist."); //Might be better to do something else

            string password = null;

            if (Request.Headers.Any(x => "Authorization".Equals(x.Key)))
            {
                password = Request.Headers.GetValues("Authorization").First();

                if (!password.Equals(enterprise.Password))
                    throw new HttpException(403, "That password was incorrect");
            }

            return new EnterpriseDetailsDTO(enterprise);
        }
    }
}
