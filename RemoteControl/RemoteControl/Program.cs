﻿using Constellation;
using Constellation.Package;
using RemoteControl.PushBullet.MessageCallbacks;
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


            int seuil = 90;
            PackageHost.WriteInfo($"seuil de tolérance processeur à {seuil}%");

            bool k = false; // initialisation en état processeur faible
            PackageHost.SubscribeStateObjects(sentinel: "PC-EMERIC", package: "HWMonitor");
            PackageHost.StateObjectUpdated += (s, e) =>
            {
                if (e.StateObject.Name == "/ram/load/0")
                {
                    if (!k && e.StateObject.DynamicValue.Value > seuil)
                    {
                        k = !k;
                        MyConstellation.Packages.Pushbullet.CreatePushBulletScope().SendPush(new SendPushRequest
                        {
                            Message = $"Utilisation de la mémoire RAM à {e.StateObject.DynamicValue.Value}% supérieure au seuil de {seuil}%",
                            Title = $"Message from {e.StateObject.SentinelName}"
                        });
                    }
                    else if (k && e.StateObject.DynamicValue.Value < seuil)
                    {
                        k = !k;
                    }
                }
            };
        }

        [MessageCallback]
        void SetVolume(int valeur)
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
        void SetVolume(string level)
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

        [MessageCallback]
        void panicMode()
        {
            Process nircmd = new Process();

            string path = Path.Combine(Path.GetTempPath(), "nircmd.exe");
            File.WriteAllBytes(path, RemoteControl.Properties.Resources.nircmd);

            nircmd.StartInfo.FileName = path;
            nircmd.StartInfo.Arguments = string.Format("sendkeypress rwin+d");
            nircmd.Start();

        }

        [MessageCallback]
        void openDoge()
        {
            Process dogeBrowser = new Process();
            dogeBrowser.StartInfo.UseShellExecute = true;
            dogeBrowser.StartInfo.FileName = "https://www.reddit.com/r/doge/";
            dogeBrowser.Start();
        }

        [MessageCallback]
        void openBrowser(string url)
        {
            Process browser = new Process();
            browser.StartInfo.UseShellExecute = true;
            browser.StartInfo.FileName = url;
            browser.Start();
        }

        [MessageCallback]
        void openMediaPlayer()
        {
            PackageHost.ControlManager.StartPackage("PC-EMERIC_UI", "MediaPlayer");
            PackageHost.PushStateObject("MediaPlayerState", true);
        }

        [MessageCallback]
        void closeMediaPlayer()
        {
            PackageHost.ControlManager.StopPackage("PC-EMERIC_UI", "MediaPlayer");
            PackageHost.PushStateObject("MediaPlayerState", false);
        }

    }
}