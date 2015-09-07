'use strict';

angular.module('workboxApp')
  .controller('MainCtrl', function ($scope, $http, $location, Auth) {
    $scope.loggedIn = function() {
      return Auth.getToken() != undefined;
    }
    $scope.logOut = function() {
      console.log('logged out');
      Auth.logout();
      $location.path('/');
    }
  });
