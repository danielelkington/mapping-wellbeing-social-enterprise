using System;
using System.Web.Http;

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
