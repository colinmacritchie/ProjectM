'use strict';

angular.module('workboxApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'MetronicApp'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    $urlRouterProvider
      .otherwise('/signup');

    $httpProvider.interceptors.push('tokenInterceptor');
  })
  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });
