var constellation = $.signalR.createConstellationConsumer("http://localhost:8088", "6d540ec121c933fe48ea0ad3872d5b98dec65226", "RemoteControl")
var tableau = document.getElementById("CurrentPlaylist");


constellation.connection.stateChanged(function (change) {
    if (change.newState === $.signalR.connectionState.connected) {
        $("#state").text("Connecté")
        constellation.server.requestSubscribeStateObjects("PCDEPIERRE_UI", "MediaPlayer", "*", "*");
    } else {
        $("#state").text("Non connecté")
    }
});

constellation.client.onUpdateStateObject(function (stateobject) {
    console.log(stateobject);
    if (stateobject.Name == "CurrentSong") {
        $("#CurrentSong").text(stateobject.Value[0].Item3);
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
            var colonne2 = ligne.insertCell(1);
            colonne2.innerHTML += stateobject.Value[i].Item2;
        }
    }
});


    
$("#SearchArtist").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["MediaPlayer"]}, "loadArtist", document.getElementById("search").value)
});

$("#SearchAlbum").click(function () {
    constellation.server.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "loadAlbum", document.getElementById("search").value)
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
    constellation.server.sendMessageWithSaga({ Scope: "Package", Args: ["MediaPlayer"] }, "shuffle", "", function (result) {
        console.log("shuffleState", result);
        $("#shuffleState").text(result.Data == true ? "on" : "off");
        });
});


constellation.connection.start();

