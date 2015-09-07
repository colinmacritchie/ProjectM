'use strict';

MetronicApp.controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();
    });
    
    $scope.treedata = 
		[
		    { "label" : "Box 1", "id" : "box1", "children" : [
		        { "label" : "Box 1.1", "id" : "box11", "children" : [] },
		        { "label" : "Box 1.2", "id" : "box12", "children" : [
		            { "label" : "Box 1.2.1", "id" : "box121", "children" : [
		                { "label" : "Box 1.2.1.1", "id" : "box1211", "children" : [] },
		                { "label" : "Box 1.2.1.2", "id" : "box1212", "children" : [] }
		            ]}
		        ]}
		    ]},
		    { "label" : "Box 2", "id" : "box2", "children" : [] },
		    { "label" : "Box 3", "id" : "box3", "children" : [] }
		];  

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = false;
		
});