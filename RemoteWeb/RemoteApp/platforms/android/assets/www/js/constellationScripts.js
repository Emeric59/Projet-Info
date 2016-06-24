﻿angular
    .module('remote.constellationScripts', ['ngConstellation'])
    .controller('MyController', ['$scope', 'constellationConsumer',
        function ($scope, constellation) {

            $scope.state = false; // scope permet de faire que la variable soit utilisée par le html, et pas seulement réduite au js

            constellation.intializeClient("http://localhost:8088", "615bd655bc724bc2c8eccf001f0aaf7df557849b", "RemoteAngular");


            constellation.onUpdateStateObject(function (stateobject) {
                $scope.$apply(function () {
                    if ($scope[stateobject.PackageName] == undefined) {
                        $scope[stateobject.PackageName] = {};
                    }
                    $scope[stateobject.PackageName][stateobject.Name] = stateobject;
                });
            });

            constellation.onConnectionStateChanged(function (change) {
                $scope.$apply(function () {
                    $scope.state = change.newState === $.signalR.connectionState.connected;
                });
                if (change.newState === $.signalR.connectionState.connected) {
                    constellation.requestSubscribeStateObjects("MSI-FLO_UI", "*", "*", "*");
                }

            });

            $scope.monitoroff = function () {
                
                constellation.server.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetVolume", "mute");

                
            };

            $scope.slider = {};
            $scope.slider.rangeValue = 0;

            $scope.$watch('slider.rangeValue', function (val, old) {
                $scope.slider.rangeValue = parseInt(val);
                console.log('range=' + $scope.slider.rangeValue)

            });

            $scope.volume = {};
            $scope.volume.value = 0;
            $scope.$watch('volume.value', function (val, old) {
                $scope.volume.value = parseInt(val);
                console.log('range=' + $scope.volume.value)
            });
            constellation.connect();
        }]);