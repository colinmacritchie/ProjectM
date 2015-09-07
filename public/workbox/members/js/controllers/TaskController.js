'use strict';

MetronicApp.controller('TaskController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        Metronic.initAjax(); // initialize core components    
        var url = String(document.location);
        if(url.indexOf("?") > -1){
        	$scope.taskId = url.split("?")[1].split("=")[1];
        	$scope.getTask();
        	$scope.loadAllAlerts();
            $scope.loadAllNotes();
        }
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = false;
    
    $scope.taskName = "name";
    	
    $scope.getTask = function(){
    	$http.get('../api/task/'+$scope.taskId).
		  	  success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
		  		  /* Task Model
		  		   * _id
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
				  console.log('success get task');
				  var obj = data;
				  $scope.taskName = (obj.name);
				  $scope.taskDescription = (obj.description);
				  $scope.taskOwner = (obj.owner);
				  $scope.taskCreator = (obj.creator);
				  $scope.dateCreated = (obj.dateCreated).split("T")[0];
				  $scope.dateEdited = (obj.dateEdited).split("T")[0];
				  var active = "false";
				  if(obj.active == true){
					  active = "true";
				  }
				  $scope.taskActive = (active);
				  $scope.dateDue = (obj.dateDue).split("T")[0];
				  $scope.dateStart = (obj.dateStart).split("T")[0];
				  $scope.dateComplete = (obj.dateComplete).split("T")[0];
				  $scope.taskStatus = (obj.status);
				  $scope.taskPriority = (obj.priority);
				  $scope.hoursEstimate = (obj.hoursEstimate);
				  $scope.hoursActual = (obj.hoursActual);
				  $scope.hoursToDo = (obj.hoursToDo);
				  var customObj = obj.custom;
		    	    if(obj.custom == undefined){
		    	    	customObj = {};
		    	    }
		    	    if(customObj.projectId == undefined){
		    	    	customObj.projectId = 0;
		    	    }
				  $scope.projectId = customObj.projectId;
				  $scope.getProject();
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
    }
    
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
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
    }
    
   	$scope.showErrorMessage = function(){
   		alert("An error has occurred.  Please report issue to support.");
   	}
    
    $scope.saveUpdateTask = function(){
    	console.log('saving updates to task');
		$http.put('../api/task', {"task": {"_id":$scope.taskId,
			"name":document.taskForm.taskName.value,
			"description":document.taskForm.taskDescription.value,
//			"owner":document.taskForm.taskOwner.value,
			"active":document.taskForm.taskActive.value,
			"dateDue":document.taskForm.dateDue.value,
			"dateStart":document.taskForm.dateStart.value,
			"dateComplete":document.taskForm.dateComplete.value,
			"hoursEstimate":document.taskForm.hoursEstimate.value,
			"hoursActual":document.taskForm.hoursActual.value,
			"hoursToDo":document.taskForm.hoursToDo.value,
			"status":document.taskForm.taskStatus.value,
			"priority":document.taskForm.taskPriority.value}}).
	  	  success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
			  console.log('success update task');
			  $scope.getTask();
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
	    	var messageObj = {rows:messageData};
	    	
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
	    	
	    	$scope.alertsGrid.parse(messageObj,"json"); //takes the name and format of the data source
	    	
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
	    	    if(obj.taskId == $scope.taskId){
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
	    $http.post('../api/note', {"note": {"name": "New Note","taskId":$scope.taskId}}).
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

    	$scope.formats = ['yyyy-MMMM-dd', 'yyyy/MM/dd', 'yyyy.MM.dd', 'shortDate'];
    	$scope.format = $scope.formats[0];
    	
    	$('.grid-stack').on('resizestop', function (event, ui) {	
    	    var grid = this;
    	    var element = event.target;
    	    switch(element.id){
    	    case "itemAlerts":
    	    	$scope.resizeAlertsGrid(document.getElementById('itemAlerts').clientHeight, document.getElementById('itemAlerts').clientWidth);
    	    	break; 
    	    case "itemNotes":
    	    	$scope.resizeNotesGrid(document.getElementById('itemNotes').clientHeight, document.getElementById('itemNotes').clientWidth);
    	    	break;
    	    }
    	});
});