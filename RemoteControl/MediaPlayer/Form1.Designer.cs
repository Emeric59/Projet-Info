using System;
using System.Collections.Generic;
using Constellation;
using Constellation.Package;
using AxWMPLib;
using WMPLib;
using System.Threading.Tasks;
using System.Threading;

namespace MediaPlayer
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.player = new AxWMPLib.AxWindowsMediaPlayer();
            ((System.ComponentModel.ISupportInitialize)(this.player)).BeginInit();
            this.SuspendLayout();
            // 
            // player
            // 
            this.player.Enabled = true;
            this.player.Location = new System.Drawing.Point(0, 0);
            this.player.Name = "player";
            this.player.OcxState = ((System.Windows.Forms.AxHost.State)(resources.GetObject("player.OcxState")));
            this.player.Size = new System.Drawing.Size(330, 300);
            this.player.TabIndex = 0;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(330, 300);
            this.Controls.Add(this.player);
            this.Name = "Form1";
            this.Text = "Form1";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.player)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private AxWMPLib.AxWindowsMediaPlayer player;

        #region Control Function

        [MessageCallback]
        private bool shuffle(string mode)
        {
            bool shuffle = player.settings.getMode("shuffle");
            if (mode == "set")
            {
                player.settings.setMode("shuffle", !shuffle);
            }
            return shuffle;
        }

        [MessageCallback]
        private void play()
        {
            player.Ctlcontrols.play();
        }

        [MessageCallback]
        private void pause()
        {
            player.Ctlcontrols.pause();
        }

        [MessageCallback]
        private void stop()
        {
            player.Ctlcontrols.stop();
        }

        [MessageCallback]
        private void previous()
        {
            player.Ctlcontrols.previous();
        }

        [MessageCallback]
        private void next()
        {
            player.Ctlcontrols.next();
        }

        #endregion


        [MessageCallback]
        private void loadArtist(string artist)
        {
            player.currentPlaylist = player.mediaCollection.getByAuthor(artist);
        }

        /*[MessageCallback]
        private void loadVideo()
        {
            player.currentPlaylist = player.mediaCollection.getAttributeStringCollection("Title", "Video");
        }*/

        [MessageCallback]
        private void loadAlbum(string album)
        {
            player.currentPlaylist = player.mediaCollection.getByAlbum(album);
        }

        [MessageCallback]
        private void loadTitleFromPlaylist(string title)
        {
            int i = 0;
            while (i < player.currentPlaylist.count)
            {
                if (player.currentPlaylist.Item[i].getItemInfo("Title") == title)
                {
                    player.Ctlcontrols.playItem(player.currentPlaylist.Item[i]);
                    return;
                }
                i++;
            }
        }


        [MessageCallback]
        private TupleList<string, string, string> getCollection(string type, string value)
        {

            var playlist = player.mediaCollection.getByAttribute(type, value);

            int count = playlist.count;
            var collection = new TupleList<string, string, string>
            {
                {"Artist", "Album", "Title"  }
            };


            for (int i = 0; i < count; i++)
            {
                collection.Add(playlist.Item[i].getItemInfo("Author"), playlist.Item[i].getItemInfo("Album"), playlist.Item[i].getItemInfo("Title"));
            }
            return collection;

        }
        [MessageCallback]
        private TupleList<string, string, string> getPlaylist()
        {
            int count = player.currentPlaylist.count;
            var collection = new TupleList<string, string, string>
            {
                {"Artist", "Album", "Title"  }
            };


            for (int i = 0; i < count; i++)
            {
                collection.Add(player.currentPlaylist.Item[i].getItemInfo("Author"), player.currentPlaylist.Item[i].getItemInfo("Album"), player.currentPlaylist.Item[i].getItemInfo("Title"));
            }
            return collection;
        }

        private void player_MediaChange(object sender, _WMPOCXEvents_MediaChangeEvent e)
        {

            PackageHost.PushStateObject("CurrentPlaylist", getPlaylist());
            PackageHost.PushStateObject("CurrentSong", new TupleList<string, string, string> { { player.currentMedia.getItemInfo("Author"), player.currentMedia.getItemInfo("Album"), player.currentMedia.getItemInfo("Title") } });
            //Task.Factory.StartNew(() =>
            //{
            //    double i = 0;
            //    while (player.Ctlcontrols.currentPosition < player.currentMedia.duration)
            //    {
            //        if (player.Ctlcontrols.currentPosition > i)
            //        {
            //            i++;
            //            string total = convertInHHMMSS(player.currentMedia.duration);
            //            string current = convertInHHMMSS(player.Ctlcontrols.currentPosition);
            //            PackageHost.PushStateObject("TimeData", new { total, current });
            //        }

            //    }
            //    Thread.Sleep(1000);
            //});
        }

        private string convertInHHMMSS(double time)
        {
            int seconds = (int)time;
            int minutes = seconds / 60;
            int hours = minutes / 60;
            seconds = seconds % 60;
            minutes = minutes % 60;
            return string.Format("{0}:{1}:{2}", hours, minutes, seconds);
        }

    }

    public class TupleList<T1, T2, T3> : List<Tuple<T1, T2, T3>>
    {
        public void Add(T1 artist, T2 album, T3 title)
        {
            Add(new Tuple<T1, T2, T3>(artist, album, title));
        }
    }
}
