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


            $scope.createTask = function (titre,description,jour,mois,annee,heure,minute) {
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "TaskCreator", [titre,description,jour,mois,annee,heure,minute]);

            }


            $scope.mute = function () {
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetVolume", "mute");

            }


            $scope.monitoroff = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "MonitorOff", "");

            };

            $scope.panicMode = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "PanicMode", "");

            };

            $scope.shutdown = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "Shutdown", "");

            };

            $scope.sleep = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "Sleep", "");

            };

            $scope.balance = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetPowerPlan", "balanced");

            };

            $scope.save = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetPowerPlan", "saver");

            };

            $scope.high = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetPowerPlan", "high");

            };

            $scope.reboot = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "Reboot", "");

            };

            $scope.play = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "Play", "");

            };

            $scope.pause = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "Pause", "");

            };

            $scope.stop = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "Stop", "");

            };

            $scope.previous = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "Previous", "");

            };

            $scope.next = function () {

                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "Next", "");

            };

            $scope.run = function () {


                if ($scope.consumer.RemoteControl.MediaPlayerState.Value == false) {
                    $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "CloseMediaPlayer", "");

                } else {
                    $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "OpenMediaPlayer", "");

                }
            };

            $scope.shuffle = function () {

                $scope.consumer.sendMessageWithSaga({ Scope: "Package", Args: ["MediaPlayer"] }, "Shuffle", "set", function (result) {
                    $scope.shuffleState = (result.Data == true ? "off" : "on");
                });
            };

            $scope.searchArtist = function (artist) {
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "LoadArtist", artist);
            };

            $scope.searchAlbum = function (album) {
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "LoadAlbum", album);
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
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "SetTime", rangeValue.value);
            }

           $scope.browse = function (URL) {
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "OpenBrowser", URL);
            };

            $scope.titleOnAlbumClick = function (song) {
                console.log(song.Item2);
            };

            $scope.getVideos = function () {
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["MediaPlayer"] }, "GetVideos", album);
            }


        }]);