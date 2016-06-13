$("#Mute").click(function () {
    cconstellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetVolume", {"mute"});
});
});
$("#IncreaseVolume").click(function () {
    cconstellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetVolume", {"plus"});
});
});
$("#DecreaseVolume").click(function () {
    cconstellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetVolume", {"moins"});
});
});