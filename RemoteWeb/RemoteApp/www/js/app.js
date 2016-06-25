// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


angular.module('remote', ['ionic', 'ngConstellation', 'remote.controllers', 'remote.constellationScripts'])


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

     // scope permet de faire que la variable soit utilisée par le html, et pas seulement réduite au js

    $rootScope.consumer.intializeClient("http://localhost:8088", "6d540ec121c933fe48ea0ad3872d5b98dec65226", "RemoteAngular");



    $rootScope.consumer.onUpdateStateObject(function (stateobject) {
        
        if ($rootScope.consumer[stateobject.PackageName] == undefined) {
            $rootScope.consumer[stateobject.PackageName] = {};
            }
        $rootScope.consumer[stateobject.PackageName][stateobject.Name] = stateobject;
           });

    $rootScope.consumer.onConnectionStateChanged(function (change) {

        $rootScope.connectionState = change.newState === $.signalR.connectionState.connected ? "Connected" : "Disconnected";

        if (change.newState === $.signalR.connectionState.connected) {
            $rootScope.consumer.requestSubscribeStateObjects("PCDEPIERRE_UI", "*", "*", "*");
        }
        $rootScope.$apply();
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
                templateUrl: 'templates/search.html'
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
                  //controller:'MyController'
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
