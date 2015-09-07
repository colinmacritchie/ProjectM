'use strict';

MetronicApp.controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();
    	$scope.loadAllAlerts();
    	$scope.loadAllProjects();
        $scope.getUsers();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = false;
  
    $http.get('../api/boxes').then(function(resp) {
    	var boxData = [];
    	for(var i = 0; i < resp.data.length; i++) {
    	    var obj = resp.data[i];
//    	    console.log(obj._id);
    	    var newObj = {};
    	    newObj.id = i+1;
    	    newObj.text = obj.name;
    	    newObj.userdata = [{name:"href", content:"#/boxes/box?id="+obj._id},{name:"_id",content:obj._id}];
    	    boxData[i] = newObj;
    	}
    	var boxWidgetData = {id:0,item:boxData};	
//         var boxWidgetData = {id:0,
//        	    item:[
//        	          {id:1,text:"Box 1",userdata:[{name:"href", content:"#/boxes/box"}]},
//        	          {id:2, text:"Box 2",userdata:[{name:"href", content:"#/boxes/box"}],child:"1",
//        	      item:[
//        	          {id:"21", text:"Box 2.1",userdata:[{name:"href", content:"#/boxes/box"}]}
//        	      ]},
//        	      {id:3,text:"Box 3",userdata:[{name:"href", content:"#/boxes/box"}]}
//        	      ]
//        	  };
    	var boxWidgetsTree = dhtmlXTreeFromHTML("boxWidget_tree"); // for script conversion
    	boxWidgetsTree.enableHighlighting(true);
    	boxWidgetsTree.enableMultiselection(false);
    	boxWidgetsTree.attachEvent("onClick",function(id){
        	document.location.href = boxWidgetsTree.getUserData(id,"href");
    	});
       	boxWidgetsTree.loadJSONObject(boxWidgetData); 
      }, function(err) {
    	  $scope.showErrorMessage();
        console.error('ERR', err);
        // err.status will contain the status code
       })
       
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
    
   	$scope.showErrorMessage = function(){
   		alert("An error has occurred.  Please report issue to support.");
   	};  
   	
   	//Loading Projects
    $scope.loadAllProjects = function(){
        $http.get('../api/projects').then(function(resp) {
        	var projectData = [];
        	console.log('loaded projects'+ resp.data.length);
        	var cnt = 0;
        	for(var i = 0; i < resp.data.length; i++) {
        		/*Project Model
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
        	    var obj = resp.data[i];
        	    console.log("project position"+obj.position);
        	    var customObj = obj.custom;
        	    if(obj.custom == undefined){
	    	    	customObj = {};
	    	    }
        	    var newObj = {};
        	    newObj.id = obj._id;
        	    newObj.position = obj.position;
        	    newObj.name = obj.name;
        	    newObj.dateStart = obj.dateStart;
        	    newObj.dateComplete = obj.dateComplete;
	    	    newObj.owner = obj.owner;
        	     //Priority,Name,Status,Owner,Description,Date Created,Date Edited,Date Start,Date Due,Creator
        	    newObj.data = [obj.priority,obj.name,obj.status,obj.owner,obj.description,obj.creator,obj.dateCreated,obj.dateEdited,obj.dateDue,obj.dateStart];
        	    projectData[cnt] = newObj;
        	    cnt++;
        	}
        	
        	projectData.sort($scope.dynamicSort("position"));
        	$scope.allProjects = projectData;
        	$scope.loadAllTasks();
        }, function(err) {
	    	  $scope.showErrorMessage();
	        console.error('ERR', err);
	        // err.status will contain the status code
	       });
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
	    	    var found = false;
	    	    for(var f =0; f< $scope.allProjects.length; f++){
	    	    	if($scope.allProjects[f].id == customObj.projectId){
	    	    		found = true;
	    	    	}
	    	    }
	    	    if(found == true){
		    	    var taskObj = {};
		    	    taskObj.id = obj._id;
		    	    taskObj.position = obj.position;
		    	    taskObj.name = obj.name;
		    	    taskObj.dateStart = obj.dateStart;
		    	    taskObj.dateComplete = obj.dateComplete;
		    	    taskObj.owner = obj.owner;
		    	    taskObj.projectId = customObj.projectId;
		    	    //Priority,Name,Status,Owner,Description,Creator,Date Created,Date Edited,Date Due,Date Start,Date Complete,Hours Estimate,Hours Actual,Hours To Do
		    	    taskObj.data = [obj.priority,obj.name,obj.status,obj.owner,obj.description,obj.creator,obj.dateCreated,obj.dateEdited,obj.dateDue,obj.dateStart,obj.dateComplete,obj.hoursEstimate,obj.hoursActual,obj.hoursToDo];
		    	    tasksData[cnt] = taskObj;
		    	    cnt++;
	    	    }
	    	}
	    	
	    	tasksData.sort($scope.dynamicSort("position"));
	    	$scope.allTasks = tasksData;
	    	$scope.createRoadmap();
	    	
	      }, function(err) {
	    	  $scope.showErrorMessage();
	        console.error('ERR', err);
	        // err.status will contain the status code
	       });
  }
   	
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
		   	        	$scope.loadAllProjects();
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
			var cnt = 0;
			//Project data
			for(var p=0; p< $scope.allProjects.length; p++){
				var prjFormatStart = $scope.allProjects[p].dateStart.split("T")[0].split("-");
				var prjStart = prjFormatStart[2] + "-" +prjFormatStart[1] + "-" + prjFormatStart[0];
				var start = new Date(prjFormatStart[0] + ","+prjFormatStart[1] + ","+prjFormatStart[2]);
				var prjFormatEnd = $scope.allProjects[p].dateComplete.split("T")[0].split("-");
				var prjEnd = prjFormatEnd[2] + "-" +prjFormatEnd[1] + "-" + prjFormatEnd[0];
				var end = new Date(prjFormatEnd[0] + "," +prjFormatEnd[1] + "," + prjFormatEnd[2]);
				var prjDuration = $scope.roadMap.calculateDuration(prjStart, prjEnd);
				var today = new Date();
				var prjTotal = end - start;
				var prjProgress = today - start;
				var decimalProgress = prjProgress/ prjTotal;
				ganttData[cnt] = {id:$scope.allProjects[p].id,text:$scope.allProjects[p].name,start_date:prjStart,end_date:prjEnd,owner:$scope.allProjects[p].owner,duration:prjDuration,order:$scope.allProjects[p].position,progress:decimalProgress,parent:0,open:true};
				cnt++;
			}
			//Task data
			for(var t=0; t< $scope.allTasks.length; t++){
				var taskFormatStart = $scope.allTasks[t].dateStart.split("T")[0].split("-");
				var taskStart = taskFormatStart[2] + "-" +taskFormatStart[1] + "-" + taskFormatStart[0];
				var start = new Date(taskFormatStart[0] + ","+taskFormatStart[1] + ","+taskFormatStart[2]);
				var taskFormatEnd = $scope.allTasks[t].dateComplete.split("T")[0].split("-");
				var taskEnd = taskFormatEnd[2] + "-" +taskFormatEnd[1] + "-" + taskFormatEnd[0];
				var end = new Date(taskFormatEnd[0] + "," +taskFormatEnd[1] + "," + taskFormatEnd[2]);
				var taskDuration = $scope.roadMap.calculateDuration(taskStart, taskEnd);
				var today = new Date();
				var taskTotal = end - start;
				var taskProgress = today - start;
				var decimalProgress = taskProgress/ taskTotal;
				ganttData[cnt] = {id:$scope.allTasks[t].id,text:$scope.allTasks[t].name,start_date:taskStart,end_date:taskEnd,owner:$scope.allTasks[t].owner,
						duration:taskDuration,order:$scope.allTasks[t].position,progress:decimalProgress,parent:$scope.allTasks[t].projectId};
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
    	    case "itemRoadMap":
    	    	$scope.resizeRoadmap(document.getElementById('itemRoadMap').clientHeight, document.getElementById('itemRoadMap').clientWidth); 
    	    	break;
    	    case "itemTeam":
    	    	$scope.resizeTeamGrid(document.getElementById('itemTeam').clientHeight, document.getElementById('itemTeam').clientWidth); 
    	    	break;
    	    }
    	});
});