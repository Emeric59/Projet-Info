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

            

            //$scope.brightness = {};
            //$scope.brightness.value = 0;

            //$scope.$watch('brightness.value', function (val, old) {
            //    $scope.brightness.value = parseInt(val);
            //    console.log('range=' + $scope.brightness.value)

            //});

            $scope.volume = {};
            $scope.volume.value = 0;
            $scope.$watch('volume.value', function (val, old) {
                $scope.volume.value = parseInt(val);
                console.log('range=' + $scope.volume.value)
            });

            $scope.brightness = {};
            $scope.brightness.value = 10;
            $scope.setBrightness = function (rangeValue) {
                console.log(rangeValue.value);
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "SetBrightness", rangeValue.value);

            };


        }]);