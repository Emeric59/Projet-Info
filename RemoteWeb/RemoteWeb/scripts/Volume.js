var constellation = $.signalR.createConstellationConsumer("http://localhost:8088", "6d540ec121c933fe48ea0ad3872d5b98dec65226", "RemoteControl")
var tableau = document.getElementById("CurrentPlaylist");
var MySentinel = "PCDEPIERRE_UI";
var PlayerState = false;

constellation.connection.stateChanged(function (change) {
    if (change.newState === $.signalR.connectionState.connected) {
        $("#state").text("Connecté")
        constellation.server.requestSubscribeStateObjects(MySentinel, "MediaPlayer", "*", "*");
        constellation.server.sendMessageWithSaga({ Scope: "Package", Args: ["MediaPlayer"] }, "shuffle", "", function (result) {
            $("#shuffleState").text(result.Data == false ? "off" : "on");
        });
        constellation.server.requestSubscribeStateObjects(MySentinel, "RemoteControl", "MediaPlayerState", "*");
        
    } else {
        $("#state").text("Non connecté")
    }
});

constellation.client.onUpdateStateObject(function (stateobject) {
    console.log(stateobject);
    if (stateobject.Name == "CurrentSong" && stateobject.Value.length != 0) {
        $("#CurrentSong").text(stateobject.Value[0].Item3);
        $("#CurrentArtist").text(stateobject.Value[0].Item1);
        $("#CurrentAlbum").text(stateobject.Value[0].Item2);
    }
    if (stateobject.Name == "CurrentPlaylist") {
        var listSize = stateobject.Value.length;
        var tableauSize = tableau.rows.length;
        for (var j = 0; j < tableauSize; j++) {
            tableau.deleteRow(-1);
        }
        for (var i = 1; i < listSize; i++) {
            var ligne = tableau.insertRow(-1);
            
            var colonne1 = ligne.insertCell(0);
            colonne1.innerHTML += stateobject.Value[i].Item3;
            colonne1.setAttribute("style", "cursor:pointer");
            colonne1.addEventListener("click", loadTitleFromList);

            var colonne2 = ligne.insertCell(1);
            colonne2.innerHTML += stateobject.Value[i].Item2;
            colonne2.setAttribute("style", "cursor:pointer");
            colonne2.addEventListener("click", loadAlbumFromList);
        }
    }
    if (stateobject.Name == "MediaPlayerState") {
        if(stateobject.Value == false){
            $("#MediaPlayerState").text("Media player déconnecté");
            PlayerState = false;
        } else {
            $("#MediaPlayerState").text("Media player connecté");
            PlayerState = true;
        }
    }
});

function loadAlbumFromList() {
    constellation.server.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "loadAlbum", this.innerHTML);
    console.log(this.innerHTML);
};

function loadTitleFromList() {
    constellation.server.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "loadTitleFromPlaylist", this.innerHTML);
    console.log(this.innerHTML);
};
    
$("#Run").click(function () {
    if (PlayerState == true) {
        constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "closeMediaPlayer", "");
    } else {
        constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "openMediaPlayer", "");
    }
});

$("#SearchArtist").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "loadArtist", document.getElementById("search").value);
});

$("#SearchAlbum").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "loadAlbum", document.getElementById("search").value);
});

$("#BackArtist").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "loadArtist", document.getElementById("CurrentArtist").innerHTML);
    console.log(document.getElementById("CurrentArtist").innerHTML);
});

$("#Mute").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetVolume", "mute");
});

$("#IncreaseVolume").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetVolume", "plus");
});

$("#DecreaseVolume").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetVolume", "moins");
});
$("#Play").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "play", "");
});
$("#Pause").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "pause", "");
});
$("#Stop").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "stop", "");
});
$("#Precedent").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "previous", "");
});
$("#Suivant").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "next", "");
});
$("#Panic").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "panicMode", "");
});
$("#MonitorOff").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "monitorOff", "");
});
$("#Shutdown").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "shutdown", "");
});
$("#Reboot").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "reboot", "");
});
$("#StandBy").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "sleep", "");
});

$("#Shuffle").click(function () {
    constellation.server.sendMessageWithSaga({ Scope: "Package", Args: ["MediaPlayer"] }, "shuffle", "set", function (result) {
        console.log("shuffleState", result);
        $("#shuffleState").text(result.Data == true ? "off" : "on");
        });
});


$("#Navigate").click(function () {
    urlNavigate= document.getElementById("urlToSearch").value
    constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "openBrowser", urlNavigate)
});

$("#PowerSaver").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "setPowerPlan", "saver");
});

$("#Balanced").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "setPowerPlan", "balanced");
});

$("#HighPerformance").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "setPowerPlan", "high");
});

$("#sendBrightness").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetBrightness", document.getElementById("brightnessValue"));
});


constellation.connection.start();

