﻿using Constellation;
using Constellation.Package;
using RemoteControl.PushBullet.MessageCallbacks;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Windows.Forms;
using NAudio.CoreAudioApi;
using System.Management;
using Microsoft.Win32.TaskScheduler;

namespace RemoteControl
{
    public partial class Program : PackageBase
    {
        static void Main(string[] args)
        {
            PackageHost.Start<Program>(args);

        }
        public override void OnStart()
        {
            // Contrôle de la RAM et envoie de push si elle dépasse le seuil indiqué

            PackageHost.PurgeStateObjects();
            MMDevice MMD = loadDefaultAudioDevice();
            MMD.AudioEndpointVolume.OnVolumeNotification += AudioEndpointVolume_OnVolumeNotification;
            PackageHost.PushStateObject("VolumeLevel", Math.Round(MMD.AudioEndpointVolume.MasterVolumeLevelScalar * 100));
            PushBrightness();

            PackageHost.WriteInfo("Package starting - IsRunning : {0} - IsConnected : {1}", PackageHost.IsRunning, PackageHost.IsConnected);
            string MySentinel = "PC-EMERIC";

            int seuil = 90;
            PackageHost.WriteInfo($"Seuil de tolérance RAM à {seuil}%");

            bool k = false; // Initialisation en état processeur faible
            PackageHost.SubscribeStateObjects(sentinel: MySentinel, package: "HWMonitor");
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

        private void AudioEndpointVolume_OnVolumeNotification(AudioVolumeNotificationData data)
        {
            double level = Math.Round(data.MasterVolume * 100);
            PackageHost.PushStateObject("VolumeLevel", level);
        }

        private MMDevice loadDefaultAudioDevice()
        {
            MMDeviceEnumerator MMDE = new MMDeviceEnumerator();
            MMDevice MMD = MMDE.GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);
            return MMD;
        }

        /// <summary>
        /// Sets the brightness.
        /// </summary>
        /// <param name="targetBrightness">The target brightness.</param>
        [MessageCallback]
        void SetBrightness(byte targetBrightness)
        {
            ManagementScope scope = new ManagementScope("root\\WMI");
            SelectQuery query = new SelectQuery("WmiMonitorBrightnessMethods");
            using (ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query))
            {
                using (ManagementObjectCollection objectCollection = searcher.Get())
                {
                    foreach (ManagementObject mObj in objectCollection)
                    {
                        mObj.InvokeMethod("WmiSetBrightness",
                            new Object[] { UInt32.MaxValue, targetBrightness });
                        PushBrightness();
                        break;
                    }
                }
            }
        }

        /// <summary>
        /// Pushes the brightness.
        /// </summary>
        static void PushBrightness()
        {
            ManagementScope scope = new ManagementScope("root\\WMI");
            SelectQuery query = new SelectQuery("SELECT * FROM WmiMonitorBrightness");
            using (ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query))
            {
                using (ManagementObjectCollection objectCollection = searcher.Get())
                {
                    foreach (ManagementObject mObj in objectCollection)
                    {
                        foreach (var item in mObj.Properties)
                        {
                            if (item.Name == "CurrentBrightness")
                            {
                                PackageHost.PushStateObject("BrightnessLevel", item.Value);

                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Sets the volume.
        /// </summary>
        /// <param name="valeur">Valeur.</param>
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

        /// <summary>
        /// Sets the power plan.
        /// </summary>
        /// <param name="plan">Plan.</param>
        [MessageCallback]
        void setPowerPlan(string plan)
        {
            switch (plan)
            {
                case "high":
                    Process.Start("powercfg", "-setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c");
                    break;
                case "saver":
                    Process.Start("powercfg", "-setactive a1841308-3541-4fab-bc81-f71556f20b4a");
                    break;
                case "balanced":
                    Process.Start("powercfg", "-setactive 381b4222-f694-41f0-9685-ff5bb260df2e");
                    break;
                default:
                    return;
            }
        }

        /// <summary>
        /// Sets the volume.
        /// </summary>
        /// <param name="level">Level.</param>
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

        /// <summary>
        /// Launch the panic mode.
        /// </summary>
        [MessageCallback]
        void panicMode()
        {
            Process nircmd = new Process();

            string path = Path.Combine(Path.GetTempPath(), "nircmd.exe");
            File.WriteAllBytes(path, RemoteControl.Properties.Resources.nircmd);

            nircmd.StartInfo.FileName = path;
            nircmd.StartInfo.Arguments = string.Format("sendkeypress rwin+d");
            nircmd.Start();
            nircmd.StartInfo.FileName = path;
            nircmd.StartInfo.Arguments = string.Format("mutesysvolume 1");
            nircmd.Start();

        }

        /// <summary>
        /// Turn off the monitor.
        /// </summary>
        [MessageCallback]
        void monitorOff()
        {
            Process nircmd = new Process();

            string path = Path.Combine(Path.GetTempPath(), "nircmd.exe");
            File.WriteAllBytes(path, RemoteControl.Properties.Resources.nircmd);

            nircmd.StartInfo.FileName = path;
            nircmd.StartInfo.Arguments = string.Format("monitor off");
            nircmd.Start();
        }

        /// <summary>
        /// Shutdowns this instance.
        /// </summary>
        [MessageCallback]
        void shutdown()
        {
            Process nircmd = new Process();

            string path = Path.Combine(Path.GetTempPath(), "nircmd.exe");
            File.WriteAllBytes(path, RemoteControl.Properties.Resources.nircmd);

            DialogResult dialogResult = MessageBox.Show("Voulez-vous vraiment éteindre l'ordinateur ?", "Shutdown ?", MessageBoxButtons.YesNo);
            if (dialogResult == DialogResult.Yes)
            {
                nircmd.StartInfo.FileName = path;
                nircmd.StartInfo.Arguments = string.Format("exitwin poweroff");
                nircmd.Start();
            }
            else if (dialogResult == DialogResult.No)
            {
                return;
            }
        }

        /// <summary>
        /// Reboots this instance.
        /// </summary>
        [MessageCallback]
        void reboot()
        {
            Process nircmd = new Process();

            string path = Path.Combine(Path.GetTempPath(), "nircmd.exe");
            File.WriteAllBytes(path, RemoteControl.Properties.Resources.nircmd);

            DialogResult dialogResult = MessageBox.Show("Voulez-vous vraiment rédemarrer l'ordinateur ?", "Reboot ?", MessageBoxButtons.YesNo);
            if (dialogResult == DialogResult.Yes)
            {
                nircmd.StartInfo.FileName = path;
                nircmd.StartInfo.Arguments = string.Format("exitwin reboot");
                nircmd.Start();
            }
            else if (dialogResult == DialogResult.No)
            {
                return;
            }
        }

        /// <summary>
        /// Sleeps this instance.
        /// </summary>
        [MessageCallback]
        void sleep()
        {
            Process nircmd = new Process();

            string path = Path.Combine(Path.GetTempPath(), "nircmd.exe");
            File.WriteAllBytes(path, RemoteControl.Properties.Resources.nircmd);

            DialogResult dialogResult = MessageBox.Show("Voulez-vous vraiment mettre en veille l'ordinateur ?", "Sleep ?", MessageBoxButtons.YesNo);
            if (dialogResult == DialogResult.Yes)
            {
                nircmd.StartInfo.FileName = path;
                nircmd.StartInfo.Arguments = string.Format("standby");
                nircmd.Start();
            }
            else if (dialogResult == DialogResult.No)
            {
                return;
            }
        }

        /// <summary>
        /// Answers the question.
        /// </summary>
        /// <param name="reponse">Reponse.</param>
        [MessageCallback]
        void answerQuestion(string reponse)
        {
            Process nircmd = new Process();

            string path = Path.Combine(Path.GetTempPath(), "nircmd.exe");
            File.WriteAllBytes(path, RemoteControl.Properties.Resources.nircmd);

            nircmd.StartInfo.FileName = path;

            switch (reponse)
            {
                case "oui":
                    nircmd.StartInfo.Arguments = string.Format("dlg \"\" \"\" click yes");
                    PackageHost.WriteInfo("On clique sur oui");
                    break;
                case "non":
                    nircmd.StartInfo.Arguments = string.Format("dlg \"\" \"\" click no");
                    break;
                default:
                    return;
            }
            nircmd.Start();
        }

        /// <summary>
        /// Opens the browser.
        /// </summary>
        /// <param name="url">URL.</param>
        [MessageCallback]
        void openBrowser(string url)
        {
            Process browser = new Process();
            browser.StartInfo.UseShellExecute = true;
            browser.StartInfo.FileName = url;
            browser.Start();
        }

        /// <summary>
        /// Opens the media player.
        /// </summary>
        [MessageCallback]
        void openMediaPlayer()
        {
            PackageHost.ControlManager.StartPackage(PackageHost.SentinelName, "MediaPlayer");
            PackageHost.PushStateObject("MediaPlayerState", true);
        }

        /// <summary>
        /// Closes the media player.
        /// </summary>
        [MessageCallback]
        void closeMediaPlayer()
        {
            PackageHost.ControlManager.StopPackage(PackageHost.SentinelName, "MediaPlayer");
            PackageHost.PushStateObject("MediaPlayerState", false);
        }


        //[MessageCallback]
        //void TaskCreator(string title, string description,int jour, int mois, int annee, int heure, int minute)
        //{


        //    MyConstellation.Packages.Pushbullet.CreatePushBulletScope().SendPush(new SendPushRequest
        //    {
        //        Message = $"Utilisation de la mémoire RAM à {e.StateObject.DynamicValue.Value}% supérieure au seuil de {seuil}%",
        //        Title = $"Message from {e.StateObject.SentinelName}"
        //    });


        //    string date = string.Format("{0}-{1}-{2} {3}:{4}:00",jour,mois,annee,heure,minute);
        //        td.Triggers.Add(new TimeTrigger() { StartBoundary = Convert.ToDateTime(date) });
        //        td.Actions.Add(new ExecAction(, null, null));
        //        ts.RootFolder.RegisterTaskDefinition(title, td);
        //}
    }
}


