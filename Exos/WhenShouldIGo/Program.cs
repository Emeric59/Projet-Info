using Constellation.Package;
using System;
using System.Linq;
using System.Threading;
using WhenShouldIGo.GoogleTraffic.MessageCallbacks;
using WhenShouldIGo.PushBullet.MessageCallbacks;

namespace WhenShouldIGo
{
    public class Program : PackageBase
    {
        static void Main(string[] args)
        {
            PackageHost.Start<Program>(args);
        }

        /// <summary>
        /// Called when the package is started.
        /// </summary>
        public override void OnStart()
        {
            PackageHost.WriteInfo($"{PackageHost.PackageName} is now running");
        }

        /// <summary>
        /// Tells me when to go.
        /// </summary>
        /// <param name="destination">The destination.</param>
        /// <param name="heureArrivee">The heure arrivee.</param>
        /// <param name="minuteArrivee">The minute arrivee.</param>
        [MessageCallback]
        public void TellMeWhen(string destination, int heureArrivee, int minuteArrivee)
        {
            var task = MyConstellation.Packages.GoogleTraffic.CreateGoogleTrafficScope().GetRoutes(PackageHost.GetSettingValue("home"), destination);
            int marge = 5; // marge de 5 min pour laisser le temps de se préparer et éviter les imprévus
            bool partir = false;
            DateTime depart = DateTime.MinValue;
            DateTime arrivee = DateTime.Today;
            arrivee = arrivee.AddHours(heureArrivee);
            arrivee = arrivee.AddMinutes(minuteArrivee);


            while (!partir)
            {
                if (task.Wait(20000) && task.IsCompleted)
                {
                    var bestRoute = task.Result.OrderBy(k => k.TimeWithTraffic).FirstOrDefault();
                    depart = DateTime.Now;
                    DateTime arriveePrevue = depart.Add(bestRoute.TimeWithTraffic);
                    if (arriveePrevue.Minute + marge >= arrivee.Minute)
                    {
                        PackageHost.WriteWarn($"Il faut partir, en prenant l'itinéraire {bestRoute.Name}/nL'arrivée est prévue vers {arriveePrevue.Hour}H{arriveePrevue.Minute}");
                        MyConstellation.Packages.Pushbullet.CreatePushBulletScope().SendPush(new SendPushRequest
                        {
                            Title = "Il faut partir pour ne pas être en retard",
                            Message = $"L'arrivée est prévue vers {arriveePrevue.Hour}H{arriveePrevue.Minute.ToString("D2")} en prenant l'itineraire {bestRoute.Name}. Le temps prévu est de {bestRoute.TimeWithTraffic.Minutes} minutes pour {bestRoute.DistanceInKm}km."
                        });
                        partir = true;
                    }
                    else
                    {
                        PackageHost.WriteInfo($"Il n'est pas encore l'heure de partir pour arriver à {arrivee.Hour}H{arrivee.Minute}");
                    }
                }
                else
                {
                    PackageHost.WriteError("Google Traffic timed out");
                }
                Thread.Sleep(60000);
            }
            PackageHost.WriteInfo($"{PackageHost.PackageName} a fini sa requête");



        }
    }
}
