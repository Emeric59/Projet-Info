// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var MySentinel = "MSI-FLO_UI";

angular.module('starter', ['ionic', 'starter.controllers','ngConstellation'])
    .controller('MyController', ['$scope', 'constellationConsumer',
        function ($scope, constellation) {

            $scope.state = false; // scope permet de faire que la variable soit utilisée par le html, et pas seulement réduite au js

            constellation.intializeClient("http://localhost:8088", "615bd655bc724bc2c8eccf001f0aaf7df557849b", "demoWebAng");

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
                    constellation.requestSubscribeStateObjects(MySentinel, "*", "*", "*");
                }

            });

            $scope.slider = {};
            $scope.slider.rangeValue = 0;

            $scope.$watch('slider.rangeValue', function (val, old) {
                $scope.slider.rangeValue = parseInt(val);
                console.log('range=' + $scope.slider.rangeValue)

            });

            $scope.volume = {};
            $scope.volume.value = 0;
            $scope.$watch('volume.value',function(val,old){
                $scope.volume.value = parseInt(val);
                console.log('range=' + $scope.volume.value)
            });

            constellation.connect();
        }])
            
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
    })

        .state('app.login', {
            url: '/login',
            views: {
                'menuContent': {
                    templateUrl: 'templates/login.html'
                }
            }
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
          //controller: 'PcControlerCtrl'
        }
      }
    })
          .state('app.TaskCreator', {
              url: '/TaskCreator',
              views: {
                  'menuContent': {
                      templateUrl: 'templates/TaskCreator.html',
                      //controller: 'TaskCreator'
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
