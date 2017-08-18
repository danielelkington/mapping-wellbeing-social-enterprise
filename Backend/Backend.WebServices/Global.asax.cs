using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace Backend.WebServices
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            Bootstrapper.Initialise();
            //Need to do this next line because we're using dbgeography
            SqlServerTypes.Utilities.LoadNativeAssemblies(Server.MapPath("~/bin"));
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
