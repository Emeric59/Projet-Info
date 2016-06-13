var constellation = $.signalR.createConstellationConsumer("http://localhost:8088", "615bd655bc724bc2c8eccf001f0aaf7df557849b", "RemoteControl")

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

