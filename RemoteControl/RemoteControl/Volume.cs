using Constellation;
using Constellation.Package;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace RemoteControl
{
    public class Volume : Program
    {
        public void SetVolume(int valeur)
        {
            double volume = valeur * 65.535;
            Process nircmd = new Process();
            nircmd.StartInfo.FileName = RemoteControl.Properties.Resources.nircmd;
            nircmd.StartInfo.Arguments = "sendkeypress 0xB3";
            nircmd.Start();
        }
    }
    

}
