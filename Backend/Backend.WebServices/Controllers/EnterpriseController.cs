
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using System;
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
        /// <returns>An EnterpriseDTO with the specified ID or null</returns>
        public EnterpriseDTO Get(int id)
        {
            ThrowExceptionIfNotHttps();
            IEnumerable<EnterpriseDTO> enterprises = Get(); //Tried using _context.Enterprises.Find(id) but always returned null.
            EnterpriseDTO enterprise = null;

            foreach (EnterpriseDTO e in enterprises)
                if (e.Id == id)
                    enterprise = e;

            if (enterprise != null && enterprise.HasPassword)
            {
                var test = RequestContext;
            }

            return enterprise;
        }
    }
}
