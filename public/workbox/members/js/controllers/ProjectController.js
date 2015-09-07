'use strict';

MetronicApp.controller('ProjectController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        Metronic.initAjax(); // initialize core components       
        var url = String(document.location);
        if(url.indexOf("?") > -1){
        	$scope.projectId = url.split("?")[1].split("=")[1];
        	$scope.getProject();
        	$scope.loadAllAlerts();
            $scope.getUsers();
            $scope.loadAllNotes();
        }
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = false;
    
    $scope.projectName = "name";
    	
    $scope.getProject = function(){
    	$http.get('../api/project/'+$scope.projectId).
		  	  success(function(data, status, headers, config) {
			    /* Project Model 
			     * _id
					name
					description
					owner - references User
					creator - references User
					dateCreated - timestamp
					dateEdited - timestamp? part of Activity Stream
					active - Boolean
					dateDue
					dateStart
					dateComplete
					status 
					priority
					custom {
					  any key value pair can be added here
					}
			     */
				  console.log('success get project');
				  var obj = data;
				  $scope.projectName = (obj.name);
				  $scope.projectDescription = (obj.description);
				  var owner = obj.owner;
				  console.log("project creator"+obj.creator);
				  $scope.projectOwner = (owner);
				  $scope.projectCreator = (obj.creator);
				  console.log('project date created' + obj.dateCreated);
				  $scope.dateCreated = (obj.dateCreated).split("T")[0];
				  $scope.dateEdited = (obj.dateEdited).split("T")[0];
				  var active = "false";
				  if(obj.active == true){
					  active = "true";
				  }
				  $scope.projectActive = (active);
				  $scope.dateDue = (obj.dateDue).split("T")[0];
				  $scope.dateStart = (obj.dateStart).split("T")[0];
				  $scope.dateComplete = (obj.dateComplete).split("T")[0];
				  $scope.projectStatus = (obj.status);
				  $scope.projectPriority = (obj.priority);
				  $scope.projectPosition = (obj.position);

				  $scope.loadAllTasks();
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
    }

   	$scope.showErrorMessage = function(){
   		alert("An error has occurred.  Please report issue to support.");
   	}
    
    $scope.saveUpdateProject = function(){
    	console.log('saving updates to project');
		$http.put('../api/project', {"project": {"_id":$scope.projectId,
			"name":document.projectForm.projectName.value,
			"description":document.projectForm.projectDescription.value,
//			"owner":document.projectForm.projectOwner.value,
			"active":document.projectForm.projectActive.value,
			"dateDue":document.projectForm.dateDue.value,
			"dateStart":document.projectForm.dateStart.value,
			"dateComplete":document.projectForm.dateComplete.value,
			"status":document.projectForm.projectStatus.value,
			"priority":document.projectForm.projectPriority.value}}).
	  	  success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
			  console.log('success update project');
			  $scope.getProject();
			  $scope.loadAllTasks();
		  }).
		  error(function(data, status, headers, config) {
			$scope.showErrorMessage();
			  console.error('ERR', err);
		  });
    }
    
    //Loading Alert Messages
    $scope.loadAllAlerts = function(){
	    $http.get('../api/messages').then(function(resp) {
	    	var messageData = [];
	    	console.log('alerts-dash'+resp.data.length);
	    	for(var i = 0; i < resp.data.length; i++) {
	    		/* Message model
	    		 *  title: { type: String, required: true, trim: true },
					 body: { type: String, required: true, trim: true },
					 created: { type: Date, required: true, default: new Date() },
					 author: { type: ObjectId, ref: 'User' },
					 box: { type: ObjectId, ref: 'Box' },
					 recipients: [{ type: ObjectId, ref: 'User' }]
	    		 */
	    	    var obj = resp.data[i];
	    	    var messageObj = {};
	    	    messageObj.id = obj._id;
	    	    messageObj.data = [obj.title,obj.body,obj.created,obj.author,obj.recipients];
	    	    messageData[i] = messageObj;
	    	}
	    	var gridMessageObj = {rows:messageData};
	    	
	       	$scope.alertsGrid = new dhtmlXGridObject('gridbox-alerts');
	    	$scope.alertsMenu = new dhtmlXMenuObject();
	    	$scope.alertsMenu.setIconsPath("js/scripts/img/");
	    	$scope.alertsMenu.renderAsContextMenu();
	    	$scope.alertsMenu.attachEvent("onClick", $scope.onAlertsMenuClick);
	    	$scope.alertsMenu.loadStruct("js/scripts/xml/alerts-menu.xml");
	    	
	    	$scope.alertsGrid.setImagePath("js/scripts/img/");          //the path to images required by grid 
	    	$scope.alertsGrid.setHeader("Name,Description,Date Created,Author,Recipients");//the headers of columns  
	    	$scope.alertsGrid.setInitWidths("150,200,150,150,200");          //the widths of columns  
	    	$scope.alertsGrid.setColAlign("left,left,left,left,left");       //the alignment of columns   
	    	$scope.alertsGrid.setColTypes("ed,ed,ro,ro,ed");                //the types of columns  
	    	$scope.alertsGrid.setColSorting("str,str,str,str,str");          //the sorting types   
	    	$scope.alertsGrid.enableMultiselect(false);
	    	$scope.alertsGrid.enableContextMenu($scope.alertsMenu);
	    	$scope.alertsGrid.attachEvent("onRowDblClicked", $scope.onAlertsGridClick);
	    	$scope.alertsGrid.enableDragAndDrop(true);
	    	$scope.alertsGrid.enableAutoHeight(true);
	    	$scope.alertsGrid.enableAutoWidth(true);
	    	$scope.alertsGrid.enableColumnAutoSize(true);
	    	$scope.alertsGrid.attachEvent("onDrop",$scope.onAlertsReorder);
	    	$scope.alertsGrid.attachEvent("onEditCell", function(stage,rId,cInd,nValue,oValue){
	    		if(stage == 2){
		    		var newAlert = {};
		    		newAlert.title = $scope.alertsGrid.cells(rId,0).getValue();
		    		newAlert.body = $scope.alertsGrid.cells(rId,1).getValue();
		    	    $scope.updateAlert(rId, newAlert);
		    	}
	    	    return true
	    	});
	    	$scope.alertsGrid.init();      //finishes initialization and renders the grid on the page     
	    	$scope.alertsGrid.setColumnHidden(2,true);
	    	$scope.alertsGrid.setColumnHidden(3,true);
	    	
	    	$scope.alertsGrid.parse(gridMessageObj,"json"); //takes the name and format of the data source
	    	
	    	$scope.resizeAlertsGrid(document.getElementById('itemAlerts').clientHeight, document.getElementById('itemAlerts').clientWidth);
	    	
	      }, function(err) {
	    	  $scope.showErrorMessage();
	        console.error('ERR', err);
	        // err.status will contain the status code
	       });
    }
	
    $scope.createAlert = function(){
	    //Save New Alert
	    $http.post('../api/message', {"message": {"title": "New Alert", "body": "new alert text"}}).
	    	  success(function(data, status, headers, config) {
    		  console.log('success new alert');
    		  $scope.loadAllAlerts();
    	  }).
    	  error(function(data, status, headers, config) {
    		  $scope.showErrorMessage();
    		 
    	  });
    };
    
    $scope.updateAlert = function(wbId,newAlert){
    	$http.put('../api/message', {"message": {"title": newAlert.title,"body":newAlert.body, "_id":wbId}}).
		  	  success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
				  console.log('success update alert');
				  $scope.loadAllAlerts();
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
    }
    
    $scope.removeAlert = function(id){
    	$http.delete('../api/message/'+id).
		  	  success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
				  console.log('success delete alert');
				$scope.loadAllAlerts();
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
    }
    
	$scope.onAlertsGridClick = function(Id,cInd){
//		document.location.href = "#/boxes/task";
	}
	
	$scope.onAlertsReorder = function(r1, r2){
		//save reorder
	}
	
	$scope.onAlertsMenuClick = function(menuitemId,type){
		var data = $scope.alertsGrid.contextID.split("_"); //rowId_colInd
		var colLabelName =$scope.alertsGrid.getColLabel(0);
		var colLabelDescription = $scope.alertsGrid.getColLabel(1);
		var rowIndex=$scope.alertsGrid.getRowIndex(data[0]);
		var wbId = $scope.alertsGrid.getRowId(rowIndex);
		switch(menuitemId){
		case "view":
//			document.location.href = "#/boxes/task";
		break;
		case "create":
			$scope.createAlert();
		break;
		case "rename":
			if(colLabelName == "Name"){
				$scope.alertsGrid.selectCell(rowIndex,0);
				$scope.alertsGrid.editCell();
			}
		break;
		case "edit":
			if(colLabelDescription == "Description"){
				$scope.alertsGrid.selectCell(rowIndex,1);
				$scope.alertsGrid.editCell();
			}
		break;
		case "remove":
//			$scope.alertsGrid.deleteRow(data[0]);
			$scope.removeAlert(wbId);
		break;
		}
		return true
	};
	
    $scope.resizeAlertsGrid = function(height, width){
    	$scope.alertsGrid.enableAutoHeight(true, height);
    	$scope.alertsGrid.enableAutoWidth(true, width);
    	$scope.alertsGrid.setSizes();
    },
    
    $scope.changeDisplayAlertsGridColumn =  function(value){
    	var colIndex = 0;
    	for(var i=0; i<$scope.alertsGrid.getColumnsNum(); i++){
    		var colLabel=$scope.alertsGrid.getColLabel(i);
    		if(colLabel == value){
    			colIndex = i;
    		}
    	}
    	var isHidden=$scope.alertsGrid.isColumnHidden(colIndex);
    	
    	 if (isHidden) {
    		 $scope.alertsGrid.setColumnHidden(colIndex,false);
         }
         else {
        	 $scope.alertsGrid.setColumnHidden(colIndex,true);
         }        	
    	
    };
    
    //Loading Tasks
    $scope.loadAllTasks = function(){
	    $http.get('../api/tasks').then(function(resp) {
	    	var tasksData = [];
	    	console.log('tasks'+resp.data.length);
	    	var cnt = 0;
	    	for(var i = 0; i < resp.data.length; i++) {
	    		/* Task model
	    		 *  _id
					projectId - References Project
					name
					description
					owner- references User
					creator - references User
					dateCreated - timestamp
					dateEdited - timestamp? part of Activity Stream
					active - Boolean
					dateDue
					dateStart
					dateComplete
					status - References ProjectStatus
					priority
					hoursEstimate
					hoursActual
					hoursToDo
					custom {
					  any key value pair 
					}
	    		 */
	    	    var obj = resp.data[i];
	    	    var customObj = obj.custom;
	    	    if(obj.custom == undefined){
	    	    	customObj = {};
	    	    }
	    	    if(customObj.projectId == undefined){
	    	    	customObj.projectId = 0;
	    	    }
	    	    if(obj.position == undefined){
	    	    	obj.position = 0;
	    	    }
	    	    if(customObj.projectId == $scope.projectId){
		    	    var taskObj = {};
		    	    taskObj.id = obj._id;
		    	    taskObj.position = obj.position;
		    	    taskObj.name = obj.name;
		    	    taskObj.dateStart = obj.dateStart.split("T")[0];
		    	    taskObj.dateComplete = obj.dateComplete.split("T")[0];
		    	    var owner = obj.owner;
					  if(obj.owner == undefined){
						  owner = "";
					  }
		    	    taskObj.owner = owner;
		    	    //Priority,Name,Status,Owner,Description,Creator,Date Created,Date Edited,Date Due,Date Start,Date Complete,Hours Estimate,Hours Actual,Hours To Do
		    	    taskObj.data = [obj.priority,obj.name,obj.status,obj.owner,obj.description,obj.creator,obj.dateCreated,obj.dateEdited,obj.dateDue,obj.dateStart,obj.dateComplete,obj.hoursEstimate,obj.hoursActual,obj.hoursToDo];
		    	    tasksData[cnt] = taskObj;
		    	    cnt++;
	    	    }
	    	}
	    	
	    	tasksData.sort($scope.dynamicSort("position"));
	    	$scope.allTasks = tasksData;
	    	$scope.createRoadmap();
	    	$scope.createStatus();
	    	
	    	var gridTaskObj = {rows:tasksData};
	    	
	       	$scope.tasksGrid = new dhtmlXGridObject('gridbox-tasks');
	    	$scope.tasksMenu = new dhtmlXMenuObject();
	    	$scope.tasksMenu.setIconsPath("js/scripts/img/");
	    	$scope.tasksMenu.renderAsContextMenu();
	    	$scope.tasksMenu.attachEvent("onClick", $scope.onTasksMenuClick);
	    	$scope.tasksMenu.loadStruct("js/scripts/xml/menu.xml");
	    	
	    	$scope.tasksGrid.setImagePath("js/scripts/img/");          //the path to images required by grid 
	    	$scope.tasksGrid.setHeader("Priority,Name,Status,Owner,Description,Creator,Date Created,Date Edited,Date Due,Date Start,Date Complete,Hours Estimate,Hours Actual,Hours To Do");//the headers of columns  
	    	$scope.tasksGrid.setInitWidths("75,200,100,150,100,100,100,100,100,100,100,100,100,100");          //the widths of columns  
	    	$scope.tasksGrid.setColAlign("center,left,left,left,left,left,left,left,left,left,left,left,left,left");       //the alignment of columns   
	    	$scope.tasksGrid.setColTypes("ro,ed,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");                //the types of columns  
	    	$scope.tasksGrid.setColSorting("int,str,str,str,str,str,str,str,str,str,str,str,str,str");          //the sorting types   
	    	$scope.tasksGrid.enableMultiselect(false);
	    	$scope.tasksGrid.enableContextMenu($scope.tasksMenu);
	    	$scope.tasksGrid.attachEvent("onRowDblClicked", $scope.onTasksGridClick);
	    	$scope.tasksGrid.enableDragAndDrop(true);
	    	$scope.tasksGrid.enableAutoHeight(true);
	    	$scope.tasksGrid.enableAutoWidth(true);
	    	$scope.tasksGrid.enableColumnAutoSize(true);
	    	$scope.tasksGrid.attachEvent("onDrop",$scope.onTasksReorder);
	    	$scope.tasksGrid.attachEvent("onEditCell", function(stage,rId,cInd,nValue,oValue){
	    		if(stage == 2){
		    	    $scope.updateTask(rId, $scope.tasksGrid.cells(rId,1).getValue());
		    	}
	    	    return true
	    	});
	    	$scope.tasksGrid.init();      //finishes initialization and renders the grid on the page     
	    	for(k=4; k<14; k++){
	    		$scope.tasksGrid.setColumnHidden(k,true);
	    	}
	    	
	    	$scope.tasksGrid.parse(gridTaskObj,"json"); //takes the name and format of the data source
	    	
	    	$scope.resizeTasksGrid(document.getElementById('itemTasks').clientHeight, document.getElementById('itemTasks').clientWidth);
	    	
	      }, function(err) {
	    	  $scope.showErrorMessage();
	        console.error('ERR', err);
	        // err.status will contain the status code
	       });
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
	
    $scope.addNewTask = function(){
	    //Save New Task
	    $http.post('../api/task', {"task": {"name": "New Task","position":0,"projectId":$scope.projectId,"custom":{"projectId":$scope.projectId}}}).
	    	  success(function(data, status, headers, config) {
    		  console.log('success new alert');
    		  $scope.loadAllTasks();
    	  }).
    	  error(function(data, status, headers, config) {
    		  $scope.showErrorMessage();
    		 
    	  });
    };
    
    $scope.updateTask = function(wbId,newName){
    	$http.put('../api/task', {"task": {"name": newName,"_id":wbId}}).
		  	  success(function(data, status, headers, config) {
				  console.log('success update task');
				  $scope.loadAllTasks();
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
    }
    
    $scope.removeTask = function(id){
    	$http.delete('../api/task/'+id).
		  	  success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
				  console.log('success delete task');
				$scope.loadAllTasks();
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
    }
    
	$scope.onTasksGridClick = function(Id,cInd){
		document.location.href = "#/boxes/task?id="+Id;
	}
	
	$scope.onTasksReorder = function(sId,tId,dId,sObj,tObj,sCol,tCol){
		//save reorder
		$scope.updateTaskPosition(sId,tCol);
		$scope.updateTaskPosition(tId,$scope.tasksGrid.getRowIndex(tId));
	}
	
	$scope.updateTaskPosition = function(wbId, position){
		$http.put('../api/task', {"task": {"position": position, "_id":wbId}}).
	  	  success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
			  console.log('success update task');
		  }).
		  error(function(data, status, headers, config) {
			$scope.showErrorMessage();
			  console.error('ERR', err);
		  });
	}
	
	$scope.onTasksMenuClick = function(menuitemId,type){
		var data = $scope.tasksGrid.contextID.split("_"); //rowId_colInd
		var colLabelName =$scope.tasksGrid.getColLabel(1);
		var rowIndex=$scope.tasksGrid.getRowIndex(data[0]);
		var wbId = $scope.tasksGrid.getRowId(rowIndex);
		switch(menuitemId){
		case "view":
			document.location.href = "#/boxes/task?id="+wbId;
		break;
		case "create":
			$scope.addNewTask();
		break;
		case "rename":
			if(colLabelName == "Name"){
				$scope.tasksGrid.selectCell(rowIndex,1);
				$scope.tasksGrid.editCell();
			}
		break;
		case "remove":
			$scope.removeTask(wbId);
		break;
		}
		return true
	};
	
    $scope.resizeTasksGrid = function(height, width){
    	$scope.tasksGrid.enableAutoHeight(true, height);
    	$scope.tasksGrid.enableAutoWidth(true, width);
    	$scope.tasksGrid.setSizes();
    },
    
    $scope.changeDisplayTaskGridColumn =  function(value){
    	var colIndex = 0;
    	for(var i=0; i<$scope.tasksGrid.getColumnsNum(); i++){
    		var colLabel=$scope.tasksGrid.getColLabel(i);
    		if(colLabel == value){
    			colIndex = i;
    		}
    	}
    	var isHidden=$scope.tasksGrid.isColumnHidden(colIndex);
    	
    	 if (isHidden) {
    		 $scope.tasksGrid.setColumnHidden(colIndex,false);
         }
         else {
        	 $scope.tasksGrid.setColumnHidden(colIndex,true);
         }        	
    	
    };
    
    
    //Loading Notes
    $scope.loadAllNotes = function(){
	    $http.get('../api/notes').then(function(resp) {
	    	var notesData = [];
	    	console.log('notes'+resp.data.length);
	    	var cnt = 0;
	    	for(var i = 0; i < resp.data.length; i++) {
	    		/* Notes model
	    		 *  _id
					name: { type: String, required: true, trim: true },
				    description: { type: String, trim: true },
				    dateCreated: { type: Date, required: true, default: Date.now() },
				    dateEdited: { type: Date, required: true, default: Date.now() },
				    position: {type: String, trim: true},
				    active: { type: Boolean, default: true },
				    custom: { type: Object },
				    owner: { type: ObjectId, ref: 'User' },
				    creator: { type: ObjectId, ref: 'User' },
				    projectId: { type: ObjectId, ref: 'Project'},
				    taskId: { type: ObjectId, ref: 'task'}
	    		 */
	    	    var obj = resp.data[i];
	    	    if(obj.position == undefined){
	    	    	obj.position = 0;
	    	    }
	    	    if(obj.projectId == $scope.projectId){
		    	    var noteObj = {};
		    	    noteObj.id = obj._id;
		    	    noteObj.position = obj.position;
		    	    noteObj.name = obj.name;
		    	    var owner = obj.owner;
					  if(obj.owner == undefined){
						  owner = "";
					  }
					  noteObj.owner = owner;
		    	    //Name,Description,Owner,Creator,Date Created,Date Edited
					 noteObj.data = [obj.name,obj.description,obj.owner,obj.creator,obj.dateCreated,obj.dateEdited];
		    	    notesData[cnt] = noteObj;
		    	    cnt++;
	    	    }
	    	}
	    	
	    	notesData.sort($scope.dynamicSort("position"));
	    	console.log('notesData '+notesData.length);
	    	var gridNoteObj = {rows:notesData};
	    	
	       	$scope.notesGrid = new dhtmlXGridObject('gridbox-notes');
	    	$scope.notesMenu = new dhtmlXMenuObject();
	    	$scope.notesMenu.setIconsPath("js/scripts/img/");
	    	$scope.notesMenu.renderAsContextMenu();
	    	$scope.notesMenu.attachEvent("onClick", $scope.onNotesMenuClick);
	    	$scope.notesMenu.loadStruct("js/scripts/xml/alerts-menu.xml");
	    	
	    	$scope.notesGrid.setImagePath("js/scripts/img/");          //the path to images required by grid 
	    	$scope.notesGrid.setHeader("Name,Description,Owner,Creator,Date Created,Date Edited");//the headers of columns  
	    	$scope.notesGrid.setInitWidths("150,200,150,150,100,100");          //the widths of columns  
	    	$scope.notesGrid.setColAlign("left,left,left,left,left,left");       //the alignment of columns   
	    	$scope.notesGrid.setColTypes("ed,ed,ro,ro,ro,ro");                //the types of columns  
	    	$scope.notesGrid.setColSorting("str,str,str,str,str,str");          //the sorting types   
	    	$scope.notesGrid.enableMultiselect(false);
	    	$scope.notesGrid.enableContextMenu($scope.notesMenu);
	    	$scope.notesGrid.attachEvent("onRowDblClicked", $scope.onNotesGridClick);
	    	$scope.notesGrid.enableDragAndDrop(true);
	    	$scope.notesGrid.enableAutoHeight(true);
	    	$scope.notesGrid.enableAutoWidth(true);
	    	$scope.notesGrid.enableColumnAutoSize(true);
	    	$scope.notesGrid.attachEvent("onDrop",$scope.onNotessReorder);
	    	$scope.notesGrid.attachEvent("onEditCell", function(stage,rId,cInd,nValue,oValue){
	    		if(stage == 2){
		    	    $scope.updateNote(rId, $scope.notesGrid.cells(rId,0).getValue(),$scope.notesGrid.cells(rId,1).getValue());
		    	}
	    	    return true
	    	});
	    	$scope.notesGrid.init();   
	    	for(k=3; k<6; k++){
	    		$scope.notesGrid.setColumnHidden(k,true);
	    	}
	    	
	    	$scope.notesGrid.parse(gridNoteObj,"json"); 
	    	
	    	$scope.resizeNotesGrid(document.getElementById('itemNotes').clientHeight, document.getElementById('itemNotes').clientWidth);
	    	
	      }, function(err) {
	    	  $scope.showErrorMessage();
	        console.error('ERR', err);
	        // err.status will contain the status code
	       });
    }
	
    $scope.addNewNote = function(){
	    //Save New Note
	    $http.post('../api/note', {"note": {"name": "New Note","projectId":$scope.projectId}}).
	    	  success(function(data, status, headers, config) {
    		  console.log('success new note');
    		  $scope.loadAllNotes();
    	  }).
    	  error(function(data, status, headers, config) {
    		  $scope.showErrorMessage();
    		 
    	  });
    };
    
    $scope.updateNote = function(wbId,newName, newDesc){
    	$http.put('../api/note', {"note": {"name": newName,"description":newDesc,"_id":wbId}}).
		  	  success(function(data, status, headers, config) {
				  console.log('success update note');
				  $scope.loadAllNotes();
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
    }
    
    $scope.removeNote = function(id){
    	$http.delete('../api/note/'+id).
		  	  success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
				  console.log('success delete note');
				$scope.loadAllNotes();
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
    }
    
	$scope.onNotesGridClick = function(Id,cInd){
//		document.location.href = "#/boxes/task?id="+Id;
	}
	
	$scope.onNotesReorder = function(sId,tId,dId,sObj,tObj,sCol,tCol){
		//save reorder
		$scope.updateNotePosition(sId,tCol);
		$scope.updateNotePosition(tId,$scope.notesGrid.getRowIndex(tId));
	}
	
	$scope.updateNotePosition = function(wbId, position){
		$http.put('../api/note', {"note": {"position": position, "_id":wbId}}).
	  	  success(function(data, status, headers, config) {
			  console.log('success update note');
		  }).
		  error(function(data, status, headers, config) {
			$scope.showErrorMessage();
			  console.error('ERR', err);
		  });
	}
	
	$scope.onNotesMenuClick = function(menuitemId,type){
		var data = $scope.notesGrid.contextID.split("_"); //rowId_colInd
		var colLabelName = $scope.notesGrid.getColLabel(0);
		var colLabelDesc =$scope.notesGrid.getColLabel(1);
		var rowIndex=$scope.notesGrid.getRowIndex(data[0]);
		var wbId = $scope.notesGrid.getRowId(rowIndex);
		switch(menuitemId){
		case "create":
			$scope.addNewNote();
		break;
		case "rename":
			if(colLabelName == "Name"){
				$scope.notesGrid.selectCell(rowIndex,0);
				$scope.notesGrid.editCell();
			}
		break;
		case "edit":
			if(colLabelDesc == "Description"){
				$scope.notesGrid.selectCell(rowIndex,1);
				$scope.notesGrid.editCell();
			}
		break;
		case "remove":
			$scope.removeNote(wbId);
		break;
		}
		return true
	};
	
    $scope.resizeNotesGrid = function(height, width){
    	$scope.notesGrid.enableAutoHeight(true, height);
    	$scope.notesGrid.enableAutoWidth(true, width);
    	$scope.notesGrid.setSizes();
    },
    
    $scope.changeDisplayNoteGridColumn =  function(value){
    	var colIndex = 0;
    	for(var i=0; i<$scope.notesGrid.getColumnsNum(); i++){
    		var colLabel=$scope.notesGrid.getColLabel(i);
    		if(colLabel == value){
    			colIndex = i;
    		}
    	}
    	var isHidden=$scope.notesGrid.isColumnHidden(colIndex);
    	
    	 if (isHidden) {
    		 $scope.notesGrid.setColumnHidden(colIndex,false);
         }
         else {
        	 $scope.notesGrid.setColumnHidden(colIndex,true);
         }        	
    	
    };
    
    $scope.createRoadmap = function() {
    	$scope.roadMap = Gantt.getGanttInstance();

			$scope.roadMap.templates.scale_cell_class = function(date){
			    if(date.getDay()==0||date.getDay()==6){
			        return "weekend";
			    }
			};
			$scope.roadMap.templates.task_cell_class = function(item,date){
			    if(date.getDay()==0||date.getDay()==6){ 
			        return "weekend" ;
			    }
			};

			$scope.roadMap.templates.rightside_text = function(start, end, task){
				if(task.type == $scope.roadMap.config.types.milestone){
					return task.text;
				}
				return "";
			}

			$scope.roadMap.config.columns = [
			    {name:"text",       label:"Name",  width:"*", tree:false,width:80, resize:true },
			    {name:"start_date",   label:"Start Date",  template:function(obj){
					return $scope.roadMap.templates.date_grid(obj.start_date);
			    }, align: "center", width:80, resize:true },
			    {name:"end_date",   label:"End Date",  template:function(obj){
					return $scope.roadMap.templates.date_grid(obj.end_date);
			    }, align: "center", width:80, resize:true },
			    {name:"owner",   label:"Owner", align:"center", width:80, resize:true}
			];

			$scope.roadMap.attachEvent("onAfterTaskDrag", function(id, mode, e){
				if(mode == "resize"){
					console.log('update '+id + 'new dates '+$scope.roadMap.getTask(id).start_date);
					//Mon Apr 27 2015 00:00:00 GMT-0700 (PDT)
					var startDate = new Date($scope.roadMap.getTask(id).start_date);
					var endDate = new Date($scope.roadMap.getTask(id).end_date);
					//2015-04-28T18:58:48.583Z
					var newStart = startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate();//+ "T00:00:00.000Z";
					var newEnd = endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + endDate.getDate();//+ "T00:00:00.000Z";
					console.log("new start" + newStart+ " new end "+newEnd);
					if($scope.roadMap.getTask(id).parent == 0){
		   				$http.put('../api/project', {"project": {"dateStart": newStart,"dateComplete":newEnd, "_id":id}}).
		   		  	  success(function(data, status, headers, config) {
		   				  console.log('success update project');
		   				$scope.getProject();
		   	        	$scope.loadAllTasks();
		   			  }).
		   			  error(function(data, status, headers, config) {
		   				$scope.showErrorMessage();
		 				  console.error('ERR', err);
		   			  });
					}else{
		   				$http.put('../api/task', {"task": {"dateStart": newStart,"dateComplete":newEnd, "_id":id}}).
		   		  	  success(function(data, status, headers, config) {
		   				  console.log('success update task');
		   	        	$scope.loadAllTasks();
		   			  }).
		   			  error(function(data, status, headers, config) {
		   				$scope.showErrorMessage();
		 				  console.error('ERR', err);
		   			  });
					}
				}
			});
			
			$scope.roadMap.config.grid_width = 390;
			$scope.roadMap.config.grid_resize = true;
			$scope.roadMap.config.date_grid = "%F %d"
			$scope.roadMap.config.scale_height  = 60;
			$scope.roadMap.config.sort = true;
			$scope.roadMap.config.subscales = [
				{ unit:"week", step:1, date:"Week #%W"}
			];
			$scope.roadMap.init("gantt_roadmap");

			var ganttData = [];
			/*
			 * [
	                    {id:1, text:"Project #2", start_date:"01-04-2015", end_date:"25-04-2015", owner:"User 1",duration:18,order:10,
	                        progress:0.4, open: true},
	                    {id:2, text:"Task #1", 	  start_date:"02-04-2015", end_date:"05-04-2015", owner:"User 3",duration:8, order:10,
	                        progress:0.6, parent:1},
	                    {id:3, text:"Task #2",    start_date:"11-04-2015", end_date:"21-04-2015", owner:"User 2",duration:8, order:20,
	                        progress:0.6, parent:1}
	                ]
			 */
			//Project data
			var prjFormatStart = $scope.dateStart.split("-");
			var prjStart = prjFormatStart[2] + "-" +prjFormatStart[1] + "-" + prjFormatStart[0];
			var start = new Date(prjFormatStart[0] + ","+prjFormatStart[1] + ","+prjFormatStart[2]);
			var prjFormatEnd = $scope.dateComplete.split("-");
			var prjEnd = prjFormatEnd[2] + "-" +prjFormatEnd[1] + "-" + prjFormatEnd[0];
			var end = new Date(prjFormatEnd[0] + "," +prjFormatEnd[1] + "," + prjFormatEnd[2]);
			var prjDuration = $scope.roadMap.calculateDuration(prjStart, prjEnd);
			var today = new Date();
			var prjTotal = end - start;
			var prjProgress = today - start;
			var decimalProgress = prjProgress/ prjTotal;
			ganttData[0] = {id:$scope.projectId,text:$scope.projectName,start_date:prjStart,end_date:prjEnd,owner:$scope.projectOwner,duration:prjDuration,order:$scope.projectPosition,progress:decimalProgress,open:true};
			var cnt = 1;
			//Task data
			for(var t=0; t< $scope.allTasks.length; t++){
				var taskFormatStart = $scope.allTasks[t].dateStart.split("-");
				var taskStart = taskFormatStart[2] + "-" +taskFormatStart[1] + "-" + taskFormatStart[0];
				var start = new Date(taskFormatStart[0] + ","+taskFormatStart[1] + ","+taskFormatStart[2]);
				var taskFormatEnd = $scope.allTasks[t].dateComplete.split("-");
				var taskEnd = taskFormatEnd[2] + "-" +taskFormatEnd[1] + "-" + taskFormatEnd[0];
				var end = new Date(taskFormatEnd[0] + "," +taskFormatEnd[1] + "," + taskFormatEnd[2]);
				var taskDuration = $scope.roadMap.calculateDuration(taskStart, taskEnd);
				var today = new Date();
				var taskTotal = end - start;
				var taskProgress = today - start;
				var decimalProgress = taskProgress/ taskTotal;
				ganttData[cnt] = {id:$scope.allTasks[t].id,text:$scope.allTasks[t].name,start_date:taskStart,end_date:taskEnd,owner:$scope.allTasks[t].owner,
						duration:taskDuration,order:$scope.allTasks[t].position,progress:decimalProgress,parent:$scope.projectId};
				cnt++;
			}
    	    
	    	var mapData =  {data:ganttData,links:[]};
			$scope.roadMap.parse(mapData);
			$scope.resizeRoadmap(document.getElementById('itemRoadMap').clientHeight, document.getElementById('itemRoadMap').clientWidth); 
    }
    
    $scope.resizeRoadmap = function(height, width){
    	$scope.roadMap.height = height;
    	$scope.roadMap.width = width;
    	$scope.roadMap.setSizes();
    };
    
    $scope.createStatus = function() {
    	$scope.statusGantt = Gantt.getGanttInstance();

			$scope.statusGantt.templates.scale_cell_class = function(date){
			    if(date.getDay()==0||date.getDay()==6){
			        return "weekend";
			    }
			};
			$scope.statusGantt.templates.task_cell_class = function(item,date){
			    if(date.getDay()==0||date.getDay()==6){ 
			        return "weekend" ;
			    }
			};

			$scope.statusGantt.templates.rightside_text = function(start, end, task){
				if(task.type == $scope.statusGantt.config.types.milestone){
					return task.text;
				}
				return "";
			}

			$scope.statusGantt.config.columns = [
			    {name:"text",       label:"Name",  width:"*", tree:false,width:80, resize:true },
			    {name:"start_date",   label:"Start Date",  template:function(obj){
					return $scope.statusGantt.templates.date_grid(obj.start_date);
			    }, align: "center", width:80, resize:true },
			    {name:"end_date",   label:"End Date",  template:function(obj){
					return $scope.statusGantt.templates.date_grid(obj.end_date);
			    }, align: "center", width:80, resize:true },
			    {name:"owner",   label:"Owner", align:"center", width:80, resize:true}
			];
			$scope.statusGantt.templates.progress_text = function(start, end, task){
				return "<span style='float:left;color:white;'>"+Math.round(task.progress*100)+ "% </span>";
			};
			$scope.statusGantt.config.grid_width = 390;
			$scope.statusGantt.config.grid_resize = true;
			$scope.statusGantt.config.date_grid = "%F %d"
			$scope.statusGantt.config.scale_height  = 60;
			$scope.statusGantt.config.sort = true;
			$scope.statusGantt.config.readonly = true;
			$scope.statusGantt.config.subscales = [
				{ unit:"week", step:1, date:"Week #%W"}
			];
			$scope.statusGantt.init("gantt_status");

			var ganttData = [];
			/*
			 * [
	                    {id:1, text:"Project #2", start_date:"01-04-2015", end_date:"25-04-2015", owner:"User 1",duration:18,order:10,
	                        progress:0.4, open: true},
	                    {id:2, text:"Task #1", 	  start_date:"02-04-2015", end_date:"05-04-2015", owner:"User 3",duration:8, order:10,
	                        progress:0.6, parent:1},
	                    {id:3, text:"Task #2",    start_date:"11-04-2015", end_date:"21-04-2015", owner:"User 2",duration:8, order:20,
	                        progress:0.6, parent:1}
	                ]
			 */
			//Project data
			var prjFormatStart = $scope.dateStart.split("-");
			var prjStart = prjFormatStart[2] + "-" +prjFormatStart[1] + "-" + prjFormatStart[0];
			var start = new Date(prjFormatStart[0] + ","+prjFormatStart[1] + ","+prjFormatStart[2]);
			var prjFormatEnd = $scope.dateComplete.split("-");
			var prjEnd = prjFormatEnd[2] + "-" +prjFormatEnd[1] + "-" + prjFormatEnd[0];
			var end = new Date(prjFormatEnd[0] + "," +prjFormatEnd[1] + "," + prjFormatEnd[2]);
			var prjDuration = $scope.statusGantt.calculateDuration(prjStart, prjEnd);
			var today = new Date();
			var prjTotal = end - start;
			var prjProgress = today - start;
			var decimalProgress = prjProgress/ prjTotal;
			ganttData[0] = {id:$scope.projectId,text:$scope.projectName,start_date:prjStart,end_date:prjEnd,owner:$scope.projectOwner,duration:prjDuration,order:$scope.projectPosition,progress:decimalProgress,open:true};
			var cnt = 1;
			//Task data
			for(var t=0; t< $scope.allTasks.length; t++){
				var taskFormatStart = $scope.allTasks[t].dateStart.split("-");
				var taskStart = taskFormatStart[2] + "-" +taskFormatStart[1] + "-" + taskFormatStart[0];
				var start = new Date(taskFormatStart[0] + ","+taskFormatStart[1] + ","+taskFormatStart[2]);
				var taskFormatEnd = $scope.allTasks[t].dateComplete.split("-");
				var taskEnd = taskFormatEnd[2] + "-" +taskFormatEnd[1] + "-" + taskFormatEnd[0];
				var end = new Date(taskFormatEnd[0] + "," +taskFormatEnd[1] + "," + taskFormatEnd[2]);
				var taskDuration = $scope.statusGantt.calculateDuration(taskStart, taskEnd);
				var today = new Date();
				var taskTotal = end - start;
				var taskProgress = today - start;
				var decimalProgress = taskProgress/ taskTotal;
				ganttData[cnt] = {id:$scope.allTasks[t].id,text:$scope.allTasks[t].name,start_date:taskStart,end_date:taskEnd,owner:$scope.allTasks[t].owner,
						duration:taskDuration,order:$scope.allTasks[t].position,progress:decimalProgress,parent:$scope.projectId};
				cnt++;
			}
    	    $scope.statusReportData = ganttData;
	    	var statusData =  {data:ganttData,links:[]};
			$scope.statusGantt.parse(statusData);
			$scope.resizeStatus(document.getElementById('itemStatus').clientHeight, document.getElementById('itemStatus').clientWidth); 
    }
    
    $scope.resizeStatus = function(height, width){
    	$scope.statusGantt.height = height;
    	$scope.statusGantt.width = width;
    	$scope.statusGantt.setSizes();
    };
    
    $scope.exportStatusReport = function(){
    	console.log("exporting status report");
    	var statusReport = [];
    	statusReport[0] = ["Position", "Name", "StartDate", "EndDate", "Owner", "Progress"];
    	var cnt = 1;
    	console.log("status report columns"+statusReport[0]);
    	for(var s = 0; s< $scope.statusReportData.length; s++){
    		var displayProgress = Math.round($scope.statusReportData[s].progress *100) + "%";
    		var displayName = $scope.statusReportData[s].text;
    		if(displayName.indexOf(" ") > -1){
    			displayName = $scope.statusReportData[s].text.split(" ").join("_");
    		}
    		statusReport[cnt] = [$scope.statusReportData[s].order,displayName,$scope.statusReportData[s].start_date,$scope.statusReportData[s].end_date,$scope.statusReportData[s].owner,displayProgress];
    		console.log("status report row"+statusReport[cnt]);
    		cnt++;
    	}
    	$scope.exportToCSV("WorkBox Status Report", statusReport);
    }
    
    $scope.exportToCSV = function(filename, rows) {
        var csvFile = '';
        for (var i = 0; i < rows.length; i++) {
        	var row = rows[i];
//            csvFile += (rows[i].join(", ") + '\n');
        	var finalVal = '';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null ? '' : row[j].toString();
                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleDateString();
                };
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ', ';
                finalVal += result;
            }
            csvFile +=  (finalVal + '\n');
        }

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
    
     $scope.set_scale_units_roadmap = function(mode){
    	if(mode && mode.getAttribute){
    		mode = mode.getAttribute("value");
    	}

    	switch (mode){
    		case "work_hours":
    			$scope.roadMap.config.subscales = [
    				{unit:"hour", step:1, date:"%H"}
    			];
    			$scope.roadMap.ignore_time = function(date){
    				if(date.getHours() < 9 || date.getHours() > 16){
    					return true;
    				}else{
    					return false;
    				}
    			};

    			break;
    		case "full_day":
    			$scope.roadMap.config.subscales = [
    				{unit:"hour", step:3, date:"%H"}
    			];
    			$scope.roadMap.ignore_time = null;
    			break;
    		case "work_week":
    			$scope.roadMap.ignore_time = function(date){
    				if(date.getDay() == 0 || date.getDay() == 6){
    					return true;
    				}else{
    					return false;
    				}
    			};

    			break;
    		default:
    			$scope.roadMap.ignore_time = null;
    			break;
    	}
    	$scope.roadMap.render();
    }

    $scope.zoom_roadmap = function(val){
    	switch(val){
    		case "week":
    			$scope.roadMap.config.scale_unit = "day"; 
    			$scope.roadMap.config.date_scale = "%d %M"; 

    			$scope.roadMap.config.scale_height = 60;
    			$scope.roadMap.config.min_column_width = 30;
    			$scope.roadMap.config.subscales = [
    					  {unit:"hour", step:1, date:"%H"}
    			];
    		break;
    		case "trplweek":
    			$scope.roadMap.config.min_column_width = 70;
    			$scope.roadMap.config.scale_unit = "day"; 
    			$scope.roadMap.config.date_scale = "%d %M"; 
    			$scope.roadMap.config.subscales = [ ];
    			$scope.roadMap.config.scale_height = 35;
    		break;
    		case "month":
    			$scope.roadMap.config.min_column_width = 70;
    			$scope.roadMap.config.scale_unit = "week"; 
    			$scope.roadMap.config.date_scale = "Week #%W"; 
    			$scope.roadMap.config.subscales = [
    					  {unit:"day", step:1, date:"%D"}
    			];
    			$scope.roadMap.config.scale_height = 60;
    		break;
    		case "year":
    			$scope.roadMap.config.min_column_width = 70;
    			$scope.roadMap.config.scale_unit = "month"; 
    			$scope.roadMap.config.date_scale = "%M"; 
    			$scope.roadMap.config.scale_height = 60;
    			$scope.roadMap.config.subscales = [
    					  {unit:"week", step:1, date:"#%W"}
    			];
    		break;
    	}
    	$scope.set_scale_units_roadmap();
    	$scope.roadMap.render();
    }
    
    $scope.set_scale_units_status = function(mode){
    	if(mode && mode.getAttribute){
    		mode = mode.getAttribute("value");
    	}

    	switch (mode){
    		case "work_hours":
    			$scope.statusGantt.config.subscales = [
    				{unit:"hour", step:1, date:"%H"}
    			];
    			$scope.statusGantt.ignore_time = function(date){
    				if(date.getHours() < 9 || date.getHours() > 16){
    					return true;
    				}else{
    					return false;
    				}
    			};

    			break;
    		case "full_day":
    			$scope.statusGantt.config.subscales = [
    				{unit:"hour", step:3, date:"%H"}
    			];
    			$scope.statusGantt.ignore_time = null;
    			break;
    		case "work_week":
    			$scope.statusGantt.ignore_time = function(date){
    				if(date.getDay() == 0 || date.getDay() == 6){
    					return true;
    				}else{
    					return false;
    				}
    			};

    			break;
    		default:
    			$scope.statusGantt.ignore_time = null;
    			break;
    	}
    	$scope.statusGantt.render();
    }

    $scope.zoom_status = function(val){
    	switch(val){
    		case "week":
    			$scope.statusGantt.config.scale_unit = "day"; 
    			$scope.statusGantt.config.date_scale = "%d %M"; 

    			$scope.statusGantt.config.scale_height = 60;
    			$scope.statusGantt.config.min_column_width = 30;
    			$scope.statusGantt.config.subscales = [
    					  {unit:"hour", step:1, date:"%H"}
    			];
    		break;
    		case "trplweek":
    			$scope.statusGantt.config.min_column_width = 70;
    			$scope.statusGantt.config.scale_unit = "day"; 
    			$scope.statusGantt.config.date_scale = "%d %M"; 
    			$scope.statusGantt.config.subscales = [ ];
    			$scope.statusGantt.config.scale_height = 35;
    		break;
    		case "month":
    			$scope.statusGantt.config.min_column_width = 70;
    			$scope.statusGantt.config.scale_unit = "week"; 
    			$scope.statusGantt.config.date_scale = "Week #%W"; 
    			$scope.statusGantt.config.subscales = [
    					  {unit:"day", step:1, date:"%D"}
    			];
    			$scope.statusGantt.config.scale_height = 60;
    		break;
    		case "year":
    			$scope.statusGantt.config.min_column_width = 70;
    			$scope.statusGantt.config.scale_unit = "month"; 
    			$scope.statusGantt.config.date_scale = "%M"; 
    			$scope.statusGantt.config.scale_height = 60;
    			$scope.statusGantt.config.subscales = [
    					  {unit:"week", step:1, date:"#%W"}
    			];
    		break;
    	}
    	$scope.set_scale_units_status();
    	$scope.statusGantt.render();
    }
    
    $scope.today = function() {
    	$scope.dt = new Date();
    	};
    	$scope.today();

    	$scope.clear = function () {
    	$scope.dt = null;
    	};

    	// Disable weekend selection
    	$scope.disabled = function(date, mode) {
    	return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    	};

    	$scope.toggleMin = function() {
    	$scope.minDate = $scope.minDate ? null : new Date();
    	};
    	$scope.toggleMin();

    	$scope.openDue = function($event) {
    	$event.preventDefault();
    	$event.stopPropagation();

    	$scope.openedDue = true;
    	};
    	
    	$scope.openStart = function($event) {
    	$event.preventDefault();
    	$event.stopPropagation();

    	$scope.openedStart = true;
    	};
        	
        $scope.openCompleted = function($event) {
    	$event.preventDefault();
    	$event.stopPropagation();

    	$scope.openedCompleted = true;
    	};

    	$scope.dateOptions = {
    	formatYear: 'yy',
    	startingDay: 1
    	};

    	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    	$scope.format = $scope.formats[0];
    	
    	$scope.getUsers = function(){
	    	$http.get('../api/users').
			  	  success(function(data, status, headers, config) {
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
				  console.log('success get users'+ data.length);
				  var usersData = [];
				  for(var i = 0; i < data.length; i++) {
					  var obj = data[i];
//    						  $scope.firstName = obj.firstName;
//    						  $scope.lastName = obj.lastName;
//    						  $scope.phoneNumber = obj.phoneNumber;
//    						  $scope.companyName = obj.companyName;
//    						  $scope.email = obj.email;
					 var newObj = {};
	        	    newObj.id = obj._id;
	        	    console.log("user id"+obj._id);
	        	    newObj.firstName = obj.firstName;
	        	    newObj.lastName = obj.lastName;
	        	    newObj.email = obj.email;
	        	    var fullName = newObj.firstName + " " + newObj.lastName;
	        	     //,Name,Email,(link)
	        	    newObj.data = ["js/scripts/img/user.png",fullName,obj.email];//,"view tasks"];
	        	    usersData[i] = newObj;
				  }
				  
			    	/*Team Widget Grid */
			    	$scope.teamGrid = new dhtmlXGridObject('gridbox-team');
			    	
			    	$scope.teamGrid.setImagePath("");          //the path to images required by grid 
			    	$scope.teamGrid.setHeader(" ,Name,Email");//,Tasks");//the headers of columns  
			    	$scope.teamGrid.setInitWidths("75, 225,225");//,100");          //the widths of columns  
			    	$scope.teamGrid.setColAlign("center, left,left");//,center");       //the alignment of columns   
			    	$scope.teamGrid.setColTypes("img,ro,ro");//,link");                //the types of columns  
			    	$scope.teamGrid.setColSorting("str,str,str");//,str");          //the sorting types   
			    	$scope.teamGrid.enableMultiselect(false);
//			    	$scope.teamGrid.attachEvent("onRowDblClicked", $scope.onTeamGridClick);
//			    	$scope.teamGrid.enableDragAndDrop(true);
			    	$scope.teamGrid.enableAutoHeight(true);
			    	$scope.teamGrid.enableAutoWidth(true);
			    	$scope.teamGrid.enableColumnAutoSize(true);
//			    	$scope.teamGrid.attachEvent("onDrop",$scope.onTeamReorder);
			    	$scope.teamGrid.init();      //finishes initialization and renders the grid on the page     
			    	
//			    	var data={
//			    		    rows:[
//			    		         { id:1, data: ["js/scripts/img/user.png","User 1", "view tasks"]},
//			    		        { id:2, data: ["js/scripts/img/user.png","User 2", "view tasks"]},
//			    		        { id:3, data: ["js/scripts/img/user.png","User 3", "view tasks"]},
//			    		        { id:4, data: ["js/scripts/img/user.png","User 4", "view tasks"]}
//			    		    ]
//			    		};
			    	var teamData = {rows:usersData};
			    	$scope.teamGrid.parse(teamData,"json"); 
			    	$scope.resizeTeamGrid(document.getElementById('itemTeam').clientHeight, document.getElementById('itemTeam').clientWidth); 
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
	    }
    	
    	$scope.onTeamGridClick = function(Id,cInd){
//    		document.location.href = "#/boxes/task";
    	}
    	
    	$scope.onTeamReorder = function(r1, r2){
    		//save reorder
    	}
    	
        $scope.resizeTeamGrid = function(height, width){
        	$scope.teamGrid.enableAutoHeight(true, height);
        	$scope.teamGrid.enableAutoWidth(true, width);
        	$scope.teamGrid.setSizes();
        };
        
        $scope.changeDisplayTeamGridColumn = function(checkbox){
        	var colIndex = 0;
        	for(i=0; i< $scope.teamGrid.getColumnsNum(); i++){
        		var colLabel= $scope.teamGrid.getColLabel(i);
        		if(colLabel == checkbox.value){
        			colIndex = i;
        		}
        	}
        	
        	 if (checkbox.checked) {
        		 $scope.teamGrid.setColumnHidden(colIndex,false);
             }
             else {
            	 $scope.teamGrid.setColumnHidden(colIndex,true);
             }        	
        	
        };
        
        $scope.exportTeamReport = function(){
        	
        };
    
    	
    	$('.grid-stack').on('resizestop', function (event, ui) {	
    	    var grid = this;
    	    var element = event.target;
    	    switch(element.id){
    	    case "itemAlerts":
    	    	$scope.resizeAlertsGrid(document.getElementById('itemAlerts').clientHeight, document.getElementById('itemAlerts').clientWidth);
    	    	break; 
    	    case "itemTasks":
    	    	$scope.resizeTaskGrid(document.getElementById('itemTasks').clientHeight, document.getElementById('itemTasks').clientWidth);
    	    	break;
    	    case "itemRoadMap":
    	    	$scope.resizeRoadmap(document.getElementById('itemRoadMap').clientHeight, document.getElementById('itemRoadMap').clientWidth); 
    	    	break;
    	    case "itemStatus":
    	    	$scope.resizeStatus(document.getElementById('itemStatus').clientHeight, document.getElementById('itemStatus').clientWidth); 
    	    	break;
    	    case "itemTeam":
    	    	$scope.resizeTeamGrid(document.getElementById('itemTeam').clientHeight, document.getElementById('itemTeam').clientWidth); 
    	    	break;
    	    case "itemNotes":
    	    	$scope.resizeNotesGrid(document.getElementById('itemNotes').clientHeight, document.getElementById('itemNotes').clientWidth);
    	    	break;
    	    }
    	});
});