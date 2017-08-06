using System.Web.Http;

namespace Backend.WebServices
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            Bootstrapper.Initialise();
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
