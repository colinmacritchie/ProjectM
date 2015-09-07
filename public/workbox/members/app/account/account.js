'use strict';

angular.module('workboxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '^/login',
        templateUrl: 'app/account/templates/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '^/signup',
        templateUrl: 'app/account/templates/signup.html',
        controller: 'SignupCtrl'
      })
      .state('features', {
        url: '^/features',
        templateUrl: 'app/account/templates/features.html',
        controller: 'FeaturesCtrl'
      })
      .state('contactus', {
        url: '^/contactus',
        templateUrl: 'app/account/templates/contactus.html',
        controller: 'ContactCtrl'
      })
      .state('pricing', {
        url: '^/pricing',
        templateUrl: 'app/account/templates/pricing.html'
      })
      .state('company', {
        url: '^/company',
        templateUrl: 'app/account/templates/company.html'
      });
  });
