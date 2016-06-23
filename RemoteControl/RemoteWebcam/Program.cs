using AsfMojo.Media;
using Constellation;
using Constellation.Package;
using Microsoft.Expression.Encoder.Devices;
using Microsoft.Expression.Encoder.Live;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;

namespace RemoteWebcam
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
            // initialise la liste des périphériques video et audio
            Collection<EncoderDevice> Vdevices = EncoderDevices.FindDevices(EncoderDeviceType.Video);

            foreach (EncoderDevice dev in Vdevices)
            {
                Console.WriteLine(dev.Name);
            }

            Console.WriteLine("Audio :");
            Collection<EncoderDevice> Adevices = EncoderDevices.FindDevices(EncoderDeviceType.Audio);

            foreach (EncoderDevice dev in Adevices)
            {
                Console.WriteLine(dev.Name);
            }
            string path;
            path = VideoCapture(Vdevices);
            ExtractFrame(path);




        }

        private string VideoCapture(Collection<EncoderDevice> Vdevices)
        {
            // Starts new job for preview window
            LiveJob _job = new LiveJob();
                        
            // Create a new device source. We use the first audio and video devices on the system
            LiveDeviceSource _deviceSource = _job.AddDeviceSource(Vdevices[0], null);

            // Make this source the active one
            _job.ActivateSource(_deviceSource);

            FileArchivePublishFormat fileOut = new FileArchivePublishFormat();

            // Sets file path and name
            string output = String.Format("D:\\WebCam{0:yyyyMMdd_hhmmss}", DateTime.Now);
            fileOut.OutputFileName = string.Format("{0}.wmv",output);

            // Adds the format to the job. You can add additional formats
            // as well such as Publishing streams or broadcasting from a port
            _job.PublishFormats.Add(fileOut);

            // Starts encoding
            _job.StartEncoding();

            Thread.Sleep(5000);

            _job.StopEncoding();

            _job.RemoveDeviceSource(_deviceSource);
            return output;
        }

        private void ExtractFrame(string input)
        {
            Bitmap bitmap = AsfImage.FromFile(string.Format("{0}.wmv", input), 1.0);
            bitmap.Save(string.Format("{0}.bmp", input));
            bitmap.Save(string.Format("D:\\latest.bmp"));
        }
    }
}
