'use strict';

var app = angular.module('workboxApp')


app.controller('LoginCtrl', function ($scope, $location, $window, Auth) {

    $scope.login = function(form) {
      Auth.login({
          username: $scope.user.email,
          password: $scope.user.password
      })
      .then( function() {
        console.log('LoginCtrl.login Success');

        // Logged in, redirect to home
        $location.path('/dashboard.html');
      })
      .catch( function(err) {
        console.log('LoginCtrl.login Error: ' + err.message);
        $scope.error = err.message;
      });
    };

  });
