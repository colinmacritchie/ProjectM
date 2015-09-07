'use strict';

MetronicApp.controller('BoxesController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        Metronic.initAjax(); // initialize core components      
        $scope.loadAllBoxes();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = false;
    
    $scope.loadAllBoxes = function(){
	    $http.get('../api/boxes').then(function(resp) {
	    	var boxData = [];
	
			console.log('loaded boxes'+ resp.data.length);
	    	for(var i = 0; i < resp.data.length; i++) {
	    	    var obj = resp.data[i];
//	    	    console.log("box position"+obj.position);
	    	    var newObj = {};
	    	    newObj.id = obj._id;
	    	    newObj.text = obj.name;
	    	    newObj.position = obj.position;
	    	    newObj.im0 = "box.gif";
	    	    newObj.im1 = "box-open.gif";
	    	    newObj.im2 = "box.gif";
	    	    newObj.userdata = [{name:"href", content:"#/boxes/box?id="+obj._id},{name:"_id",content:obj._id},{name:"type",content:"box"}];
	    	    boxData[i] = newObj;
	    	}
	    	var boxWidgetData = boxData;	
	//    	 var boxWidgetData = {id:0,
	// 	    	    item:[
	// 	    	          {id:"1",text:"Box 1", im0:"box.gif", im1:"box-open.gif", im2:"box.gif",userdata:[{name:"href", content:"#/boxes/box"}],child:"1",
	// 	    	      item:[
	// 	    	            {id:"11", text:"Project ABC", im0:"project.gif", im1:"project-open.gif", im2:"project.gif",userdata:[{name:"href", content:"#/boxes/project"}],child:"11",
	// 	    	       item:[{id:"111", text:"Task ABC", im0:"doc.gif", im1:"doc.gif", im2:"doc.gif",userdata:[{name:"href", content:"#/boxes/task"}]},
	// 	    	             {id:"112", text:"Task XYZ", im0:"doc.gif", im1:"doc.gif", im2:"doc.gif",userdata:[{name:"href", content:"#/boxes/task"}]}
	// 	    	             ]},
	// 	    	             {id:"12", text:"Box 1.2", im0:"box.gif", im1:"box-open.gif", im2:"box.gif",userdata:[{name:"href", content:"#/boxes/box"}],child:"12",
	// 	    	       item:[{id:"121", text:"Project dev", im0:"project.gif", im1:"project-open.gif", im2:"project.gif",userdata:[{name:"href", content:"#/boxes/project"}],child:"121",
	// 	    	    	   item:[{id:"1211", text:"Task dev", im0:"doc.gif", im1:"doc.gif", im2:"doc.gif",userdata:[{name:"href", content:"#/boxes/task"}]},
	// 	    	             {id:"1212", text:"Task test", im0:"doc.gif", im1:"doc.gif", im2:"doc.gif",userdata:[{name:"href", content:"#/boxes/task"}]}
	// 	    	             ]},
	// 	    	          ]},
	    	boxWidgetData.sort($scope.dynamicSort("position"));
        	$scope.loadAllTasks(boxWidgetData);
		     
	      }, function(err) {
	    	  $scope.showErrorMessage();
	        console.error('ERR', err);
	        // err.status will contain the status code
	       })
    };
       
    $scope.loadAllProjects = function(boxWidgetData, taskData){
        $http.get('../api/projects').then(function(resp) {
        	var boxData = boxWidgetData;
        	var projectData = [];

        	console.log('loaded projects'+ resp.data.length);
        	for(var i = 0; i < resp.data.length; i++) {
        	    var obj = resp.data[i];
        	    console.log("project position"+obj.position);
        	    var customObj = obj.custom;
//        	    alert(customObj.boxId);
        	    var newObj = {};
        	    newObj.id = obj._id;
        	    newObj.text = obj.name;
        	    newObj.position = obj.position;
        	    newObj.im0 = "project.gif";
        	    newObj.im1 = "project-open.gif";
        	    newObj.im2 = "project.gif";
        	    newObj.userdata = [{name:"href", content:"#/boxes/project?id="+obj._id},{name:"_id",content:obj._id},{name:"type",content:"project"},{name:"boxId",content:customObj.boxId}];
        	    var tasks = [];
        	    var cnt = 0;
        	    for(var t = 0; t< taskData.length; t++){
        	    	if(taskData[t].projectId == obj._id){
        	    		tasks[cnt] = taskData[t];
        	    		cnt++;
        	    	}
        	    }
        	    newObj.item = tasks;
        	    projectData[i] = newObj;
        	}
        	
        	projectData.sort($scope.dynamicSort("position"));
        	
        	for(var k = 0; k< boxData.length; k++){
        		var boxItems = [];
        		var cnt = 0;
        		for(var a = 0; a< projectData.length; a++){
        			var customData = projectData[a].userdata;
            		var boxId = "";
            		for(var c = 0; c< customData.length; c++){
            			var cObj = customData[c];
            			if(cObj.name == "boxId"){
            				boxId = cObj.content;
            			}
            		}
            		if(boxData[k].id == boxId){
            			boxItems[cnt] = projectData[a];
            			cnt++;
            		}
        		}
        		boxData[k].item = boxItems;
        	}
        	
	    	boxWidgetData = {id:0,item:boxData};	//{id:0,item:[]};
	    	$scope.buildBoxesTree(boxWidgetData);
//        	boxWidgetData = boxData;	

    	     
          }, function(err) {
        	  $scope.showErrorMessage();
            console.error('ERR', err);
            // err.status will contain the status code
           })
    }
    
    $scope.loadAllTasks = function(boxWidgetData){
        $http.get('../api/tasks').then(function(resp) {
        	var boxData = boxWidgetData;
        	var taskData = []

        	console.log('loaded tasks'+ resp.data.length);
        	for(var i = 0; i < resp.data.length; i++) {
        	    var obj = resp.data[i];
        	    var customObj = obj.custom;
        	    if(customObj == undefined){
        	    	customObj = {};
        	    }
        	    if(customObj.projectId == undefined){
        	    	customObj.projectId = 0;
        	    }
        	    console.log("Task id: " + obj._id + " name: "+ obj.name + " projectId: "+ customObj.projectId + "position: "+ obj.position);
        	    var newObj = {};
        	    newObj.id = obj._id
        	    newObj.text = obj.name;
        	    if(obj.position == undefined){
        	    	obj.position = 0;
        	    }
        	    newObj.position = obj.position;
        	    newObj.projectId = customObj.projectId;
        	    newObj.im0 = "doc.gif";
        	    newObj.im1 = "doc.gif";
        	    newObj.im2 = "doc.gif";
        	    newObj.userdata = [{name:"href", content:"#/boxes/task?id="+obj._id},{name:"_id",content:obj._id},{name:"type",content:"task"},{name:"projectId",content:customObj.projectId}];
        	    taskData[i] = newObj;
        	}
        	
        	taskData.sort($scope.dynamicSort("position"));
        	
	   		$scope.loadAllProjects(boxWidgetData, taskData);
//        	console.log('boxData'+boxData.length);
//        	boxWidgetData = {id:0,item:boxData};	
//        	$scope.buildBoxesTree(boxWidgetData);
    	     
          }, function(err) {
        	  $scope.showErrorMessage();
            console.error('ERR', err);
            // err.status will contain the status code
           })
    	
    }
    
    $scope.dynamicSort = function(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    
    $scope.buildBoxesTree = function(boxWidgetData){
    	console.log('build tree');
    	$scope.boxWidgetsTree = dhtmlXTreeFromHTML("boxes_tree"); 
    	var boxesMenu = new dhtmlXMenuObject();
    	boxesMenu.setIconsPath("js/scripts/img/");
    	boxesMenu.renderAsContextMenu();
    	boxesMenu.attachEvent("onClick", $scope.onBoxesMenuClick);
    	boxesMenu.loadStruct("js/scripts/xml/boxes-menu.xml");
    	
    	$scope.boxWidgetsTree.enableContextMenu(boxesMenu);
    	$scope.boxWidgetsTree.enableHighlighting(true);
    	$scope.boxWidgetsTree.enableMultiselection(false);
    	$scope.boxWidgetsTree.enableDragAndDrop(true, false); 
    	$scope.boxWidgetsTree.setDragBehavior('sibling', true);
    	$scope.boxWidgetsTree.enableItemEditor(false);
    	$scope.boxWidgetsTree.attachEvent("onOpenEnd", $scope.onNodeChange);
    	$scope.boxWidgetsTree.attachEvent("onDrop",$scope.onReorder);
    	$scope.boxWidgetsTree.attachEvent("onDblClick", $scope.onLinkClick); 
    	$scope.boxWidgetsTree.attachEvent("onEdit", $scope.editItem); 
		
    	$scope.boxWidgetsTree.loadJSONObject(boxWidgetData); 
    	$scope.loadNodeStates();
    }
    
    $scope.loadNodeStates = function(){
    	$scope.cookieData = [];
    	var serialized_data = $scope.getCookie("boxes-dashboard-display");
    	if (serialized_data == undefined || serialized_data == null || serialized_data == ""){
    		serialized_data = null;
    	}
    	if(serialized_data == null){
    		$scope.cookieData =[];
    	}else{
    		$scope.cookieData = JSON.parse(serialized_data);
    		for(var d = 0; d< $scope.cookieData.length; d++){
    			if($scope.cookieData[d].open == true){
    				$scope.boxWidgetsTree.openItem($scope.cookieData[d].id);
    			}
        	}
    	}
    	
    }
    
    $scope.onNodeChange = function(id, state){
    	var opened = false;
    	if(state == 1){
    		opened = true;
    	}
    	var found = false;
    	for(var d = 0; d< $scope.cookieData.length; d++){
    		if($scope.cookieData[d].id == id){
    			$scope.cookieData[d].open = opened;
    			found = true;
    		}
    	}
    	if(found == false){
    		var newChange = {}
    		newChange.id = id;
    		newChange.open = opened;
    		$scope.cookieData[$scope.cookieData.length] = newChange;
    	}
    	$scope.setCookie("boxes-dashboard-display",JSON.stringify($scope.cookieData));
    	
    }
    
	$scope.onLinkClick = function(id){
		document.location.href = $scope.boxWidgetsTree.getUserData(id,"href");
	}
	
   	$scope.onReorder = function(sId, tId, id, sObject, tObject){
		//save reorder
   		if($scope.boxWidgetsTree.getLevel(sId) > 1){
   			var parent = $scope.boxWidgetsTree.getParentId(sId);
   			$scope.updatePosition(sId);
   			$scope.updatePosition(tId);
   			//need to update parent?
   		}else{
   			$scope.updatePosition(sId);
   			$scope.updatePosition(tId);
   		}
	}
   	
   	$scope.updatePosition = function(id){
   		var newIndex = $scope.boxWidgetsTree.getIndexById(id);
   		var wbId = $scope.boxWidgetsTree.getUserData(id,"_id");
   		switch($scope.boxWidgetsTree.getUserData(id,"type")){
			case "box":
				$http.put('../api/box', {"box": {"position": newIndex, "_id":wbId}}).
		  	  success(function(data, status, headers, config) {
				  console.log('success update box');
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
				  console.error('ERR', err);
			  });
			break;
			case "project":
				$http.put('../api/project', {"project": {"position": newIndex, "_id":wbId}}).
		  	  success(function(data, status, headers, config) {
				  console.log('success update project');
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
				  console.error('ERR', err);
			  });
			break;
			case "task":
				$http.put('../api/task', {"task": {"position": newIndex, "_id":wbId}}).
		  	  success(function(data, status, headers, config) {
				  console.log('success update task');
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
				  console.error('ERR', err);
			  });
			break;
		}
   	}
   	
   	$scope.editItem = function(state, id, tree, value){
	    if(state == 3){
	    	$scope.boxWidgetsTree.enableItemEditor(false);
	    	$scope.saveUpdate(id);
	    }
	    return true
	}
   	
   	$scope.saveUpdate = function(id){
   		var success = false;
   		var wbId = $scope.boxWidgetsTree.getUserData(id,"_id");
   		var newText = $scope.boxWidgetsTree.getItemText(id);
   		switch($scope.boxWidgetsTree.getUserData(id,"type")){
   			case "box":
   				$http.put('../api/box', {"box": {"name": newText, "_id":wbId}}).
   		  	  success(function(data, status, headers, config) {
   				  console.log('success update box');
   			  }).
   			  error(function(data, status, headers, config) {
   				$scope.showErrorMessage();
 				  console.error('ERR', err);
   			  });
   			break;
   			case "project":
   				$http.put('../api/project', {"project": {"name": newText, "_id":wbId}}).
   		  	  success(function(data, status, headers, config) {
   				  console.log('success update project');
   			  }).
   			  error(function(data, status, headers, config) {
   				$scope.showErrorMessage();
 				  console.error('ERR', err);
   			  });
   			break;
   			case "task":
   				$http.put('../api/task', {"task": {"name": newText, "_id":wbId}}).
   		  	  success(function(data, status, headers, config) {
   				  console.log('success update task');
   			  }).
   			  error(function(data, status, headers, config) {
   				$scope.showErrorMessage();
 				  console.error('ERR', err);
   			  });
   			break;
   		}
    	
   	}
   	
   	$scope.removeItem = function(id){
   		var wbId = $scope.boxWidgetsTree.getUserData(id,"_id");
   		switch($scope.boxWidgetsTree.getUserData(id,"type")){
   			case "box":
   				$http.delete('../api/box/'+wbId).
   		  	  success(function(data, status, headers, config) {
   				  console.log('success delete box');
   				$scope.loadAllBoxes();
   			  }).
   			  error(function(data, status, headers, config) {
   				$scope.showErrorMessage();
 				  console.error('ERR', err);
   			  });
   			break;
   			case "project":
   				$http.delete('../api/project/'+wbId).
   		  	  success(function(data, status, headers, config) {
   				  console.log('success delete project');
   				$scope.loadAllBoxes();
   			  }).
   			  error(function(data, status, headers, config) {
   				$scope.showErrorMessage();
 				  console.error('ERR', err);
   			  });
   			break;
   			case "task":
   				$http.delete('../api/task/'+wbId).
   		  	  success(function(data, status, headers, config) {
   				  console.log('success delete task');
   				$scope.loadAllBoxes();
   			  }).
   			  error(function(data, status, headers, config) {
   				$scope.showErrorMessage();
 				  console.error('ERR', err);
   			  });
   			break;
   		}
   	}
   	
   	$scope.showErrorMessage = function(){
   		alert("An error has occurred.  Please report issue to support.");
   	}
	
	//Widget - can create...
    //Boxes - boxes, projects, tasks
    //Projects - boxes, projects, tasks
    //Tasks - none
	$scope.onBoxesMenuClick = function(menuitemId,type){
		var id = $scope.boxWidgetsTree.contextID;
		switch(menuitemId){
			case "view":
				document.location.href = $scope.boxWidgetsTree.getUserData(id,"href");
			break;
			case "createBox":
				$scope.createNewBox();
			break;
			case "createProject":
				$scope.createNewProject($scope.boxWidgetsTree.getUserData(id,"_id"));
			break;
			case "createTask":
				$scope.createNewTask($scope.boxWidgetsTree.getUserData(id,"_id"));
			break;
			case "rename":
				$scope.boxWidgetsTree.enableItemEditor(true);
				$scope.boxWidgetsTree.editItem(id);
			break;
			case "remove":
				$scope.removeItem(id);
			break;
		}
		return true
	};
       
    $scope.createBox = function(){
	    //Save New Box
	    $http.post('../api/box', {"box": {"name": "New Box", "position": 0}}).
	    	  success(function(data, status, headers, config) {
    		  console.log('success new box');
    		  $scope.loadAllBoxes();
    	  }).
    	  error(function(data, status, headers, config) {
//    		  $scope.showErrorMessage();
    		  $scope.loadAllBoxes();
    	  });
    };
    
    $scope.createProject = function(val){
	    //Save New Project
	    $http.post('../api/project', {"project": {"name": "New Project","dateCreated":new Date(),"position":0,"custom":{"boxId":val}}}).
	    	  success(function(data, status, headers, config) {
    		  console.log('success new project');
    		  $scope.loadAllBoxes();
    	  }).
    	  error(function(data, status, headers, config) {
    		  $scope.showErrorMessage();
    		  console.error('ERR', err);
    	  });
    };
    
    $scope.createTask = function(val){
	    //Save New Task
	    $http.post('../api/task', {"task": {"name": "New Task", "position":0,"projectId": val,"custom":{"projectId":val}}}).
	    	  success(function(data, status, headers, config) {
    		  console.log('success new task');
    		  $scope.loadAllBoxes();
    	  }).
    	  error(function(data, status, headers, config) {
    		  $scope.showErrorMessage();
    		  console.error('ERR', err);
    	  });
    };
    
    $scope.expandAllTree = function(){
    	$scope.boxWidgetsTree.openAllItems(0);
    };
    
    $scope.collapseAllTree = function(){
    	$scope.boxWidgetsTree.closeAllItems(0);
    };
    
    //Widget - can create...
    //Boxes - boxes, projects
    //Projects - boxes, projects, tasks
    //Tasks - none
    $scope.createNewBox = function(){
			$scope.createBox(); 
    };

    $scope.createNewProject = function(val){
    	var d=new Date();
    	var id = 0;
    	if($scope.boxWidgetsTree.getSelectedItemId() != "" && $scope.boxWidgetsTree.getSelectedItemId() != null && $scope.boxWidgetsTree.getSelectedItemId() != undefined){
    		id = $scope.boxWidgetsTree.getSelectedItemId();
    		if(val == null){
        		val = $scope.boxWidgetsTree.getUserData(id,"_id");
        	}
        	
        	if($scope.boxWidgetsTree.getUserData(id,"type") == "box"){
        	    $scope.createProject(val);  
    		}else{
    			alert("Please select a box to add your new project.");
    		}
//        	$scope.boxWidgetsTree.insertNewNext(id,d.valueOf(),"New Project",0,"project.gif","project-open.gif","project.gif",'SELECT'); 
    	}else{
    		alert("Please select a box to add your new project.");
    	}
    	
    };

    $scope.createNewTask = function(val){
    	var id = 0;
    	if($scope.boxWidgetsTree.getSelectedItemId() != "" && $scope.boxWidgetsTree.getSelectedItemId() != null && $scope.boxWidgetsTree.getSelectedItemId() != undefined){
    		id = $scope.boxWidgetsTree.getSelectedItemId();
    		if(val == null){
        		val = $scope.boxWidgetsTree.getUserData(id,"_id");
        	}
        	
        	if($scope.boxWidgetsTree.getUserData(id,"type") == "project"){
            	console.log("new task project id "+val);
        	    $scope.createTask(val);  
    		}else{
    			alert("Please select a project to add your new task.");
    		}
    	}else{
    		alert("Please select a project to add your new task.");
    	}
    	
	};
	
	 $scope.setCookie = function(key, value) {
	    var expires = new Date();
	    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
	    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
	}

	 $scope.getCookie = function(key) {
	    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
	    return keyValue ? keyValue[2] : null;
	}
    
});