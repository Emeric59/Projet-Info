// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


angular.module('remote', ['ionic', 'ngConstellation', 'remote.controllers'])


.run(['$ionicPlatform', '$rootScope', 'constellationConsumer', function ($ionicPlatform, $rootScope, consumer) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (cordova.platformId === 'ios' && window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    $rootScope.consumer = consumer;
    $rootScope.connectionState = 'Disconnected';
    $rootScope.remoteLoaded = false;



    // scope permet de faire que la variable soit utilis�e par le html, et pas seulement r�duite au js

    $rootScope.consumer.intializeClient("http://localhost:8088", "a28d975296302b2e3620a8626eb6d1ce56c79f23", "RemoteAngular");

    $rootScope.consumer.onConnectionStateChanged(function (change) {
        $rootScope.$apply(function () {
            $rootScope.connectionState = change.newState === $.signalR.connectionState.connected ? "Connected" : "Disconnected";
            if (change.newState === $.signalR.connectionState.connected) {
                $rootScope.consumer.requestSubscribeStateObjects("PC-EMERIC_UI", "RemoteControl", "*", "*");
                $rootScope.consumer.requestSubscribeStateObjects("PC-EMERIC_UI", "MediaPlayer", "*", "*");
                $rootScope.consumer.sendMessageWithSaga({ Scope: "Package", Args: ["MediaPlayer"] }, "shuffle", "", function (result) {
                    $rootScope.shuffleState = result.Data == false ? "off" : "on";
                });
                $rootScope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "PushBrightness", "");
            };
        })
    });

    $rootScope.consumer.onUpdateStateObject(function (stateobject) {
        $rootScope.$apply(function () {
            if ($rootScope.consumer[stateobject.PackageName] == undefined) {
                $rootScope.consumer[stateobject.PackageName] = {};
            }
            $rootScope.consumer[stateobject.PackageName][stateobject.Name] = stateobject;
            if ($rootScope.consumer.RemoteControl.VolumeLevel != undefined && $rootScope.consumer.RemoteControl.BrightnessLevel != undefined) {
                $rootScope.remoteLoaded = true;

            }

        })

    });


    $rootScope.consumer.connect();


}])



.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'templates/menu.html',
          controller: 'AppCtrl'
      })


    .state('app.search', {
        url: '/search',
        views: {
            'menuContent': {
                templateUrl: 'templates/search.html',
                controller: 'MyController'
            }
        }
    })

    .state('app.browse', {
        url: '/browse',
        views: {
            'menuContent': {
                templateUrl: 'templates/browse.html'
            }
        }
    })
      .state('app.PcControler', {
          url: '/PcControler',
          views: {
              'menuContent': {
                  templateUrl: 'templates/PcControler.html',
                  controller: 'MyController'
              }
          }
      })



    .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
            'menuContent': {
                templateUrl: 'templates/playlist.html',
                controller: 'PlaylistCtrl'
            }
        }

    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/search');
});
