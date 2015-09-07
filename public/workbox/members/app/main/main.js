'use strict';

angular.module('workboxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/index.html',
        controller: 'MainCtrl'
      });
  });
