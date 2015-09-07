'use strict';

MetronicApp.controller('BoxController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        Metronic.initAjax(); // initialize core components    
        var url = String(document.location);
        if(url.indexOf("?") > -1){
        	$scope.boxId = url.split("?")[1].split("=")[1];
        	$scope.getBox();
        	$scope.loadAllProjects();
        }
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = false;
        
    $scope.boxName = "name";
    	
    $scope.getBox = function(){
    	$http.get('../api/box/'+$scope.boxId).
		  	  success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
				  console.log('success get box');
				  var obj = data;
				  $scope.boxName = (obj.name);
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
    }

   	$scope.showErrorMessage = function(){
   		alert("An error has occurred.  Please report issue to support.");
   	}
   	
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
	    	    if(customObj.boxId == undefined){
	    	    	customObj.boxId = 0;
	    	    }
	    	    if(obj.position == undefined){
	    	    	obj.position = 0;
	    	    }
	    	    if(customObj.boxId == $scope.boxId){
	        	    var newObj = {};
	        	    newObj.id = obj._id;
	        	    newObj.position = obj.position;
	        	    newObj.name = obj.name;
	        	    console.log("project created"+obj.dateCreated);
	        	    newObj.dateStart = obj.dateStart;
	        	    newObj.dateComplete = obj.dateComplete;
	        	    console.log('project owners '+obj.owner);
		    	    newObj.owner = obj.owner;
	        	     //Priority,Name,Status,Owner,Description,Date Created,Date Edited,Date Start,Date Due,Creator
	        	    newObj.data = [obj.priority,obj.name,obj.status,obj.owner,obj.description,obj.creator,obj.dateCreated,obj.dateEdited,obj.dateDue,obj.dateStart];
	        	    projectData[cnt] = newObj;
	        	    cnt++;
	    	    }
        	}
        	
        	projectData.sort($scope.dynamicSort("position"));
        	$scope.allProjects = projectData;
        	$scope.loadAllTasks();
        	
	    	var gridProjectObj = {rows:projectData};
	    	
	       	$scope.projectsGrid = new dhtmlXGridObject('gridbox-projects');
	    	$scope.projectsMenu = new dhtmlXMenuObject();
	    	$scope.projectsMenu.setIconsPath("js/scripts/img/");
	    	$scope.projectsMenu.renderAsContextMenu();
	    	$scope.projectsMenu.attachEvent("onClick", $scope.onProjectsMenuClick);
	    	$scope.projectsMenu.loadStruct("js/scripts/xml/menu.xml");
	    	
	    	$scope.projectsGrid.setImagePath("js/scripts/img/");          //the path to images required by grid 
	    	$scope.projectsGrid.setHeader("Priority,Name,Status,Owner,Description,Creator,Date Created,Date Edited,Date Due,Date Start,Date Complete");//the headers of columns  
	    	$scope.projectsGrid.setInitWidths("75,200,100,150,100,100,100,100,100,100,100");          //the widths of columns  
	    	$scope.projectsGrid.setColAlign("center,left,left,left,left,left,left,left,left,left,left");       //the alignment of columns   
	    	$scope.projectsGrid.setColTypes("ro,ed,ro,ro,ro,ro,ro,ro,ro,ro,ro");                //the types of columns  
	    	$scope.projectsGrid.setColSorting("int,str,str,str,str,str,str,str,str,str,str");          //the sorting types   
	    	$scope.projectsGrid.enableMultiselect(false);
	    	$scope.projectsGrid.enableContextMenu($scope.projectsMenu);
	    	$scope.projectsGrid.attachEvent("onRowDblClicked", $scope.onProjectsGridClick);
	    	$scope.projectsGrid.enableDragAndDrop(true);
	    	$scope.projectsGrid.enableAutoHeight(true);
	    	$scope.projectsGrid.enableAutoWidth(true);
	    	$scope.projectsGrid.enableColumnAutoSize(true);
	    	$scope.projectsGrid.attachEvent("onDrop",$scope.onProjectsReorder);
	    	$scope.projectsGrid.attachEvent("onEditCell", function(stage,rId,cInd,nValue,oValue){
	    		if(stage == 2){
		    	    $scope.updateProject(rId, $scope.projectsGrid.cells(rId,1).getValue());
		    	}
	    	    return true
	    	});
	    	$scope.projectsGrid.init();      //finishes initialization and renders the grid on the page     
	    	for(k=4; k<11; k++){
	    		$scope.projectsGrid.setColumnHidden(k,true);
	    	}
	    	
	    	$scope.projectsGrid.parse(gridProjectObj,"json"); //takes the name and format of the data source
	    	
	    	$scope.resizeProjectsGrid(document.getElementById('itemProjects').clientHeight, document.getElementById('itemProjects').clientWidth);
	    	
        }, function(err) {
	    	  $scope.showErrorMessage();
	        console.error('ERR', err);
	        // err.status will contain the status code
	       });
    };
    
    $scope.addNewProject = function(){
	    //Save New Project
	    $http.post('../api/project', {"project": {"name": "New Project","position":0,"custom":{"boxId":$scope.boxId}}}).
	    	  success(function(data, status, headers, config) {
    		  console.log('success new project');
    		  $scope.loadAllProjects();
    	  }).
    	  error(function(data, status, headers, config) {
    		  $scope.showErrorMessage();
    		 
    	  });
    };
    
    $scope.updateProject = function(wbId,newName){
    	$http.put('../api/project', {"project": {"name": newName,"_id":wbId}}).
		  	  success(function(data, status, headers, config) {
				  console.log('success update project');
				  $scope.loadAllProjects();
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
    }
    
    $scope.removeProject = function(id){
    	$http.delete('../api/project/'+id).
		  	  success(function(data, status, headers, config) {
				  console.log('success delete project');
				$scope.loadAllProjects();
			  }).
			  error(function(data, status, headers, config) {
				$scope.showErrorMessage();
			  console.error('ERR', err);
			  });
    }
    
	$scope.onProjectsGridClick = function(Id,cInd){
		document.location.href = "#/boxes/project?id="+Id;
	}
	
	$scope.onProjectsReorder = function(sId,tId,dId,sObj,tObj,sCol,tCol){
		//save reorder
		$scope.updateProjectPosition(sId,tCol);
		$scope.updateProjectPosition(tId,$scope.projectsGrid.getRowIndex(tId));
	}
	
	$scope.updateProjectPosition = function(wbId, position){
		$http.put('../api/project', {"project": {"position": position, "_id":wbId}}).
	  	  success(function(data, status, headers, config) {
			  console.log('success update project');
		  }).
		  error(function(data, status, headers, config) {
			$scope.showErrorMessage();
			  console.error('ERR', err);
		  });
	}
	
	$scope.onProjectsMenuClick = function(menuitemId,type){
		var data = $scope.projectsGrid.contextID.split("_"); //rowId_colInd
		var colLabelName =$scope.projectsGrid.getColLabel(1);
		var rowIndex=$scope.projectsGrid.getRowIndex(data[0]);
		var wbId = $scope.projectsGrid.getRowId(rowIndex);
		switch(menuitemId){
		case "view":
			document.location.href = "#/boxes/project?id="+wbId;
		break;
		case "create":
			$scope.addNewProject();
		break;
		case "rename":
			if(colLabelName == "Name"){
				$scope.projectsGrid.selectCell(rowIndex,1);
				$scope.projectsGrid.editCell();
			}
		break;
		case "remove":
			$scope.removeProject(wbId);
		break;
		}
		return true
	};
	
    $scope.resizeProjectsGrid = function(height, width){
    	$scope.projectsGrid.enableAutoHeight(true, height);
    	$scope.projectsGrid.enableAutoWidth(true, width);
    	$scope.projectsGrid.setSizes();
    },
    
    $scope.changeDisplayProjectGridColumn =  function(value){
    	var colIndex = 0;
    	for(var i=0; i<$scope.projectsGrid.getColumnsNum(); i++){
    		var colLabel=$scope.projectsGrid.getColLabel(i);
    		if(colLabel == value){
    			colIndex = i;
    		}
    	}
    	var isHidden=$scope.projectsGrid.isColumnHidden(colIndex);
    	
    	 if (isHidden) {
    		 $scope.projectsGrid.setColumnHidden(colIndex,false);
         }
         else {
        	 $scope.projectsGrid.setColumnHidden(colIndex,true);
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
	    	var gridTaskObj = {rows:tasksData};
	    	
	       	$scope.tasksGrid = new dhtmlXGridObject('gridbox-tasks');
	    	$scope.tasksMenu = new dhtmlXMenuObject();
	    	$scope.tasksMenu.setIconsPath("js/scripts/img/");
	    	$scope.tasksMenu.renderAsContextMenu();
	    	$scope.tasksMenu.attachEvent("onClick", $scope.onTasksMenuClick);
	    	$scope.tasksMenu.loadStruct("js/scripts/xml/edit-menu.xml");
	    	
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
    	
	$('.grid-stack').on('resizestop', function (event, ui) {	
	    var grid = this;
	    var element = event.target;
	    switch(element.id){
	    case "itemProjects":
	    	$scope.resizeProjectGrid(document.getElementById('itemProjects').clientHeight, document.getElementById('itemProjects').clientWidth);
	    	break;
	    case "itemTasks":
	    	$scope.resizeTaskGrid(document.getElementById('itemTasks').clientHeight, document.getElementById('itemTasks').clientWidth);
	    	break;
	    case "itemRoadMap":
	    	$scope.resizeRoadmap(document.getElementById('itemRoadMap').clientHeight, document.getElementById('itemRoadMap').clientWidth); 
	    	break;
	    }
	});
	
});