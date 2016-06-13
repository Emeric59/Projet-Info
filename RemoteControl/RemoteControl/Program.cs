using Constellation;
using Constellation.Package;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;



namespace RemoteControl
{
    public class Program : PackageBase
    {
        static void Main(string[] args)
        {
            PackageHost.Start<Program>(args);
            
        }

        public override void OnStart()
        {
            PackageHost.WriteInfo("Package starting - IsRunning : {0} - IsConnected : {1}", PackageHost.IsRunning, PackageHost.IsConnected);
            PackageHost.WriteInfo("Les Doges c'est trop bien.");
        }

        [MessageCallback]
        public static void SetVolume(int valeur)
        {
            double volume = valeur * 655.35;
            Process nircmd = new Process();

            string path = Path.Combine(Path.GetTempPath(), "nircmd.exe");
            File.WriteAllBytes(path, RemoteControl.Properties.Resources.nircmd);

            nircmd.StartInfo.FileName = path;
            nircmd.StartInfo.Arguments = string.Format("setsysvolume {0}", volume);
            nircmd.Start();
        }
        [MessageCallback]
        public static void SetVolume(string level)
        {
            Process nircmd = new Process(); 

            string path = Path.Combine(Path.GetTempPath(), "nircmd.exe");
            File.WriteAllBytes(path, RemoteControl.Properties.Resources.nircmd);

            nircmd.StartInfo.FileName = path;

            switch (level)
            {
                case "mute":
                    nircmd.StartInfo.Arguments = "mutesysvolume 2";
                    break;
                case "max":
                    nircmd.StartInfo.Arguments = "setsysvolume 58981";
                    break;
                case "min":
                    nircmd.StartInfo.Arguments = "setsysvolume 6553";
                    break;
                default:
                    return;
            }
            nircmd.Start();
        }


    }
}