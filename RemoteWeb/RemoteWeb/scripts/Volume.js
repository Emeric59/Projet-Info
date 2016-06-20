var constellation = $.signalR.createConstellationConsumer("http://localhost:8088", "615bd655bc724bc2c8eccf001f0aaf7df557849b", "RemoteControl")
var tableau = document.getElementById("CurrentPlaylist");


constellation.connection.stateChanged(function (change) {
    if (change.newState === $.signalR.connectionState.connected) {
        $("#state").text("Connecté")
        constellation.server.requestSubscribeStateObjects("MSI-FLO_UI", "MediaPlayer", "*", "*");
        constellation.server.sendMessageWithSaga({ Scope: "Package", Args: ["MediaPlayer"] }, "shuffle", "", function (result) {
            console.log("shuffleState", result);
            $("#shuffleState").text(result.Data == false ? "off" : "on");
        });
        var PlayerState = constellation.server.requestStateObjects("MSI-FLO_UI", "RemoteControl", "MediaPlayerState", "*");
        console.log(PlayerState.Value);
        $("#MediaPlayerState").text(stateobject.Value);

    } else {
        $("#state").text("Non connecté")
    }
});

constellation.client.onUpdateStateObject(function (stateobject) {
    console.log(stateobject);
    if (stateobject.Name == "CurrentSong") {
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
    console.log($("#MediaPlayerState"));

    if ($("#MediaPlayerState") == true) {
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

$("#Shuffle").click(function () {
    constellation.server.sendMessageWithSaga({ Scope: "Package", Args: ["MediaPlayer"] }, "shuffle", "set", function (result) {
        console.log("shuffleState", result);
        $("#shuffleState").text(result.Data == true ? "off" : "on");
        });
});


constellation.connection.start();

