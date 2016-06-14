var constellation = $.signalR.createConstellationConsumer("http://localhost:8088", "6d540ec121c933fe48ea0ad3872d5b98dec65226", "RemoteControl")

constellation.connection.stateChanged(function (change) {
    if (change.newState === $.signalR.connectionState.connected) {
        $("#state").text("Connecté")
    } else {
        $("#state").text("Non connecté")
    }
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

constellation.connection.start();

