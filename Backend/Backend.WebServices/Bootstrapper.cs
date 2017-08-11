using Backend.WebServices.DatabaseEntities;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Dependencies;

namespace Backend.WebServices
{
    public class Bootstrapper
    {
        public static void Initialise()
        {
            var container = BuildUnityContainer();
            //Resolve controllers using Unity to inject dependencies.
            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }

        /// <summary>
        /// Providing our own implementation of IDependencyResolver that uses Unity to resolve
        /// controllers.
        /// </summary>
        private class UnityDependencyResolver : IDependencyResolver
        {
            private IUnityContainer _container;
            public UnityDependencyResolver(IUnityContainer container)
            {
                _container = container;
            }
            public IDependencyScope BeginScope()
            {
                return this;
            }

            public void Dispose()
            {
                
            }

            public object GetService(Type serviceType)
            {
                object instance;
                try
                {
                    instance = _container.Resolve(serviceType);
                }
                catch(ResolutionFailedException)
                {
                    instance = null;
                }
                return instance;
            }

            public IEnumerable<object> GetServices(Type serviceType)
            {
                return _container.ResolveAll(serviceType);
            }
        }

        /// <summary>
        /// Register special types for the Unity Container
        /// </summary>
        /// <returns></returns>
        private static IUnityContainer BuildUnityContainer()
        {
            var container = new UnityContainer();

            container.RegisterType<IContext, Context>();

            return container;
        }
    }
}