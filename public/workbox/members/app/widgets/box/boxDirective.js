'use strict';

angular.module('workboxApp')
    .directive('box', function () {
    return {
        restrict: 'AE',
        scope: {

        },
        controller: 'BoxController',
        templateUrl: 'app/components/box/box-tpl.html',
        link: function(scope, elem, attrs, ctrl) {

            }
        }
    });
