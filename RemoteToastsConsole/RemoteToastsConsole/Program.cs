using Constellation;
using Constellation.Package;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Windows.UI.Notifications;
using NotificationsExtensions.Toasts;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.Data.Xml.Dom;
using System.IO;

namespace RemoteToastsConsole
{
    public class Program : PackageBase
    {
        static void Main(string[] args)
        {
            PackageHost.Start<Program>(args);
        }

        public override void OnStart()
        {
            PackageHost.WriteInfo("Package starting - IsRunning: {0} - IsConnected: {1}", PackageHost.IsRunning, PackageHost.IsConnected);

            

            // Get the toast notification manager for the current app.
            var notificationManager = ToastNotificationManager;

            var template = notifications.toastTemplateType.toastImageAndText01;
            XmlDocument toastXml = ToastNotificationManager.GetTemplateContent()

            ToastNotificationManager.CreateToastNotifier().Show(new ToastNotification(testDoc));




        }










        

    }
}
