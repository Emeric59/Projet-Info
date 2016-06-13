using Constellation;
using Constellation.Package;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.IO;

namespace RemoteControl
{
    public class Volume : Program
    {
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
                case "plus":
                    nircmd.StartInfo.Arguments = "changesysvolume 1310";
                    break;
                case "moins":
                    nircmd.StartInfo.Arguments = "changesysvolume -1310";
                    break;
                default:
                    return;
            }
            nircmd.Start();
        }
    }
}