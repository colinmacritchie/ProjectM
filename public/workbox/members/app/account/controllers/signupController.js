'use strict';

var app = angular.module('workboxApp')

app.controller('SignupCtrl', function ($scope, $location, $window, Auth) {

    $scope.signup = function(form) {
      Auth.createUser({
          username: $scope.user.email,
          password: $scope.user.password,
          fullname: $scope.user.fullname,
          companyname: $scope.user.companyname
      })
      .then( function(val) {
        console.log('SignupCtrl.signup Success');
        // Account created, redirect to home
        $location.path('/dashboard.html');
      })
      .catch( function(err) {
        console.log('SignupCtrl.signup Error: ' + JSON.stringify(err));
      });
    };

  });
