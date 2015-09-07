'use strict';

MetronicApp.controller('UserProfileController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        Metronic.initAjax(); // initialize core components
        Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu 
        
        $scope.getUser();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = false;
    
    $scope.getUser = function(){
    	$http.get('../api/users/me').
		  	  success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
		  		  /* User Model
		  		   * "username":"test@test.com","password":"test","fullname":"Test Person","companyname":"Test Company"}
		  		   * firstName:{ type: String, trim: true },
    				lastName: { type: String, trim: true }, 
				    phoneNumber: { type: String, trim: true },
				    companyName: { type: String, required: false, trim: true },
				    email: { type: String, required: true, unique: true, trim: true },
				    role: {
				        type: String,
				        default: 'user'
				    },
				    password: { type: String, required: true, trim: true },
				    joined: { type: Date, required: false, default: new Date() },
				    companies: [{type: ObjectId, ref: 'Company'}],
				    messages: [{ type: ObjectId, ref: 'Message' }],
				    boxes: [{ type: ObjectId, ref: 'Box' }],
				    projects: [{ type: ObjectId, ref: 'Project' }],
				    tasks: [{ type: ObjectId, ref: 'Task' }],
				    widgets:
		  		   */
				  console.log('success get user');
				  var obj = data;
				  $scope.firstName = obj.firstName;
				  $scope.lastName = obj.lastName;
				  $scope.phoneNumber = obj.phoneNumber;
				  $scope.companyName = obj.companyName;
				  $scope.email = obj.email;
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
    }
    
    $scope.saveUpdateUser = function(){
    	console.log('saving updates to user');
		$http.put('../api/users/me', {"user": {"_id":$scope.userId,
			"firstName":document.userForm.firstName.value,
			"lastName":document.userForm.lastName.value,
			"phoneNumber":document.userForm.phoneNumber.value,
			"companyName":document.userForm.companyName.value,
			"email":document.userForm.email.value}}).
	  	  success(function(data, status, headers, config) {
			  console.log('success update user');
			  $scope.getUser();
		  }).
		  error(function(data, status, headers, config) {
			$scope.showErrorMessage();
			  console.error('ERR', err);
		  });
    }
    
   	$scope.showErrorMessage = function(){
   		alert("An error has occurred.  Please report issue to support.");
   	}
}); 
