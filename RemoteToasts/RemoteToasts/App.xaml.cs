using Constellation.Package;
using System;
using System.Windows;

namespace RemoteToasts
{
    public partial class App : Application, IPackage
    {
        [STAThread]
        public static void Main(string[] args = null)
        {
            PackageHost.Start<App>(args);
        }

        public void OnStart()
        {
            this.Exit += (s, e) => PackageHost.Shutdown();
            this.Run(new MainWindow());
        }

        public void OnPreShutdown()
        {

        }

        public void OnShutdown()
        {
            if (Application.Current != null)
            {
                this.Dispatcher.BeginInvoke(new Action(() => Application.Current.Shutdown()), null);
            }
        }
    }
}
