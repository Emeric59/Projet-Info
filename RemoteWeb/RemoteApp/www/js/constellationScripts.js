angular
    .module('remote.constellationScripts', [])
    .controller('MyController', ['$scope', 
        function ($scope) {

            $scope.monitoroff = function () {
                
                $scope.consumer.sendMessage({ Scope: "Package", Args: ["RemoteControl"] }, "monitorOff", "");

                
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
            
        }]);