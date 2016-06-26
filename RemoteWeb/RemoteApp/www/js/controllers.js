angular.module('remote.controllers', [])

.controller('AppCtrl2', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);


        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // Form data for the login modal
    $scope.taskData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/taskCreator.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeTask = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.taskCreator = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doTask = function () {
        console.log('Doing task', $scope.taskData);


        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeTask();
        }, 1000);
    };
})


.controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
})

.controller('PlaylistCtrl', function ($scope, $stateParams) {
})

.controller('MyController', ['$scope',
        function ($scope) {

            $scope.consumer.onUpdateStateObject(function (stateobject) {
                if ($scope.remoteLoaded) {
                    $scope.volume.value = $scope.consumer.RemoteControl.VolumeLevel.Value.level;
                    $scope.brightness.value = $scope.consumer.RemoteControl.BrightnessLevel.Value;
                };
                if ($scope.mediaLoaded) {
                    if ($scope.position != undefined) {
                        $scope.position.value = $scope.consumer.MediaPlayer.TimeData.Value.currentPosition;
                    }
                };
            });


            $scope.mute = function () {
                console.log('mute');
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetVolume", "mute");

            }


            $scope.monitoroff = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "monitorOff", "");

            };

            $scope.panicMode = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "panicMode", "");

            };

            $scope.shutdown = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "shutdown", "");

            };

            $scope.sleep = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "sleep", "");

            };

            $scope.balance = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "setPowerPlan", "balanced");

            };

            $scope.save = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "setPowerPlan", "saver");

            };

            $scope.high = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "setPowerPlan", "high");

            };

            $scope.reboot = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "reboot", "");

            };

            $scope.play = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "play", "");

            };

            $scope.pause = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "pause", "");

            };

            $scope.stop = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "stop", "");

            };

            $scope.previous = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "previous", "");

            };

            $scope.next = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "next", "");

            };

            $scope.run = function () {


                if ($scope.consumer.RemoteControl.MediaPlayerState.Value == false) {
                    $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "closeMediaPlayer", "");

                } else {
                    $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "openMediaPlayer", "");

                }
            };

            $scope.shuffle = function () {

                $scope.consumer.sendMessageWithSaga({ Scope: "Package", Args: ["MediaPlayer"] }, "shuffle", "set", function (result) {
                    $scope.shuffleState = (result.Data == true ? "off" : "on");
                });
            };

            $scope.searchArtist = function (artist) {
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "loadArtist", artist);
            };

            $scope.searchAlbum = function (album) {
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "loadAlbum", album);
            };

            $scope.volume = {};

            $scope.SetVolume = function (rangeValue) {
                console.log(rangeValue.value);
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetVolume", rangeValue.value);
            };

            $scope.brightness = {};
            $scope.SetBrightness = function (rangeValue) {
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetBrightness", rangeValue.value);
            };

            $scope.position = {};
            $scope.SetPosition = function (rangeValue) {
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "setTime", rangeValue.value);
            }

            $scope.titleOnAlbumClick = function (song) {
                console.log(song.Item2);
            };



        }]);