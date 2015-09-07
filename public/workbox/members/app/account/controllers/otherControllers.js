'use strict';

var app = angular.module('workboxApp')

app.controller('FeaturesCtrl', function ($scope) {
    $scope.show = 1;
});

app.controller('ContactCtrl', function ($http, $scope) {
    $scope.sendemail = function() {
        var message = 'name: ' + $scope.name + '\nemail: ' + $scope.email + '\nmessage: ' +  $scope.message; 
        $http({
            url: '/send', 
            method: 'GET',
            params: {
                subject: $scope.regarding,
                text: message
            }
         })
    }
});
