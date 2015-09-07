/**
Box Module
**/
var Box = function () {

    // private functions & variables

    var _initComponents = function() {
    	
    }
    
    var createProjectsGrid = function() {
    	/*Projects Widget Grid */
    	var projectsGrid = new dhtmlXGridObject('gridbox-projects');
    	var projectsMenu = new dhtmlXMenuObject();
    	projectsMenu.setIconsPath("js/scripts/img/");
    	projectsMenu.renderAsContextMenu();
    	projectsMenu.attachEvent("onClick", onProjectsMenuClick);
    	projectsMenu.loadStruct("js/scripts/xml/menu.xml");
    	
    	projectsGrid.setImagePath("js/scripts/img/");          //the path to images required by grid 
    	projectsGrid.setHeader("Priority,Name,Status,Owner,Date Created,Date Edited,Date Start,Date Due,Creator,Description");//the headers of columns  
    	projectsGrid.setInitWidths("80,200,100,150,100,100,100,100,100,100");          //the widths of columns  
    	projectsGrid.setColAlign("center,left,left,left,left,left,left,left,left,left");       //the alignment of columns   
    	projectsGrid.enableResizing("true, true, true, true,true,true,true,true,true,true"); //resize columns
    	projectsGrid.setColTypes("ro,ed,ro,ro,ro,ro,ro,ro,ro,ro");                //the types of columns  
    	projectsGrid.setColSorting("int,str,str,str,str,str,str,str,str,str");          //the sorting types   
    	projectsGrid.enableMultiselect(false);
    	projectsGrid.enableContextMenu(projectsMenu);
    	projectsGrid.attachEvent("onRowDblClicked", onProjectsGridClick);
    	projectsGrid.enableDragAndDrop(true);
    	projectsGrid.enableAutoHeight(true);
    	projectsGrid.enableAutoWidth(true);
    	projectsGrid.enableColumnAutoSize(true);
    	projectsGrid.attachEvent("onDrop",onProjectsReorder);
    	projectsGrid.init();      //finishes initialization and renders the grid on the page     

    	for(j=4; j<10; j++){
    		projectsGrid.setColumnHidden(j,true);
    	}
		
    	var data={
    		    rows:[
    		        { id:4, data: ["4", "Project 4", "in progress", "User 1"]},
    		        { id:2, data: ["2", "Project 2", "complete", "User 2"]},
    		        { id:3, data: ["3", "Project 3", "in progress", "User 3"]},
    		        { id:1, data: ["1", "Project 1", "in progress", "User 1"]}
    		    ]
    		};
    	projectsGrid.parse(data,"json"); //takes the name and format of the data source
    	
    	function onProjectsGridClick(Id,cInd){
    		document.location.href = "#/boxes/project";
    	}
    	
    	function onProjectsReorder(r1, r2){
    		//save reorder
    	}
    	
    	function onProjectsMenuClick(menuitemId,type){
			var data = projectsGrid.contextID.split("_"); //rowId_colInd
			var colLabel=projectsGrid.getColLabel(1);
			var rowIndex=projectsGrid.getRowIndex(data[0]);
			switch(menuitemId){
			case "view":
				document.location.href = "#/boxes/project";
			break;
			case "create":
				var newId = (new Date()).valueOf();
				projectsGrid.addRow(newId,["1", "New Project ", "in progress", "User 1"]);
			break;
			case "rename":
				if(colLabel == "Name"){
					projectsGrid.selectCell(rowIndex,1);
					projectsGrid.editCell();
				}
			break;
			case "remove":
				projectsGrid.deleteRow(data[0]);
			break;
			}
			return true
		}
    	return projectsGrid;
    }
    
    var createTasksGrid = function(){
    	/*Tasks Widget Grid */
    	var tasksGrid = new dhtmlXGridObject('gridbox-tasks');
    	var tasksMenu = new dhtmlXMenuObject();
    	tasksMenu.setIconsPath("js/scripts/img/");
    	tasksMenu.renderAsContextMenu();
    	tasksMenu.attachEvent("onClick", onTasksMenuClick);
    	tasksMenu.loadStruct("js/scripts/xml/menu.xml");
    	
    	tasksGrid.setImagePath("js/scripts/img/");          //the path to images required by grid 
    	tasksGrid.setHeader("Priority,Name,Status,Owner,Description,Creator,Date Created,Date Edited,Date Due,Date Start,Date Complete,Hours Estimate,Hours Actual,Hours To Do");//the headers of columns  
    	tasksGrid.setInitWidths("80,200,100,150,100,100,100,100,100,100,100,100,100,100");          //the widths of columns  
    	tasksGrid.setColAlign("center,left,left,left,left,left,left,left,left,left,left,left,left,left");       //the alignment of columns   
    	tasksGrid.setColTypes("ro,ed,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");                //the types of columns  
    	tasksGrid.setColSorting("int,str,str,str,str,str,str,str,str,str,str,str,str,str");          //the sorting types   
    	tasksGrid.enableMultiselect(false);
    	tasksGrid.enableContextMenu(tasksMenu);
    	tasksGrid.attachEvent("onRowDblClicked", onTasksGridClick);
    	tasksGrid.enableDragAndDrop(true);
    	tasksGrid.enableAutoHeight(true);
    	tasksGrid.enableAutoWidth(true);
    	tasksGrid.enableColumnAutoSize(true);
    	tasksGrid.attachEvent("onDrop",onTasksReorder);
    	tasksGrid.init();      //finishes initialization and renders the grid on the page     

    	for(k=4; k<14; k++){
    		tasksGrid.setColumnHidden(k,true);
    	}
    	
    	var data={
    		    rows:[
    		        { id:4, data: ["4", "Task 4", "in progress", "User 1"]},
    		        { id:2, data: ["2", "Task 2", "complete", "User 2"]},
    		        { id:3, data: ["3", "Task 3", "in progress", "User 3"]},
    		        { id:1, data: ["1", "Task 1", "in progress", "User 1"]}
    		    ]
    		};
    	tasksGrid.parse(data,"json"); //takes the name and format of the data source
    	
    	function onTasksGridClick(Id,cInd){
    		document.location.href = "#/boxes/task";
    	}
    	
    	function onTasksReorder(r1, r2){
    		//save reorder
    	}
    	
    	function onTasksMenuClick(menuitemId,type){
			var data = tasksGrid.contextID.split("_"); //rowId_colInd
			var colLabel=tasksGrid.getColLabel(1);
			var rowIndex=tasksGrid.getRowIndex(data[0]);
			switch(menuitemId){
			case "view":
				document.location.href = "#/boxes/task";
			break;
			case "create":
				var newId = (new Date()).valueOf();
				tasksGrid.addRow(newId,["1", "New Task ", "in progress", "User 1"]);
			break;
			case "rename":
				if(colLabel == "Name"){
					tasksGrid.selectCell(rowIndex,1);
					tasksGrid.editCell();
				}
			break;
			case "remove":
				tasksGrid.deleteRow(data[0]);
			break;
			}
			return true
		}
    	return tasksGrid;
    }

    // public functions
    return {

        //main function
        init: function () {
        	
        	_initComponents();
        	
        	this.projectsGrid = createProjectsGrid();
        	this.tasksGrid = createTasksGrid();
        },
    
    	addNewProject: function(){
        	var newId = (new Date()).valueOf();
			this.projectsGrid.addRow(newId,["1", "New Project ", "in progress", "User 1"]);
        },
        
        resizeProjectGrid: function(height, width){
        	this.projectsGrid.enableAutoHeight(true, height);
        	this.projectsGrid.enableAutoWidth(true, width);
        	this.projectsGrid.setSizes();
        },
        
        changeDisplayProjectGridColumn: function(checkbox){
        	var colIndex = 0;
        	for(i=0; i<this.projectsGrid.getColumnsNum(); i++){
        		var colLabel=this.projectsGrid.getColLabel(i);
        		if(colLabel == checkbox.value){
        			colIndex = i;
        		}
        	}
        	
        	 if (checkbox.checked) {
                 this.projectsGrid.setColumnHidden(colIndex,false);
             }
             else {
                 this.projectsGrid.setColumnHidden(colIndex,true);
             }        	
        	
        },
        
        addNewTask: function(){
        	var newId = (new Date()).valueOf();
			this.tasksGrid.addRow(newId,["1", "New Task ", "in progress", "User 1"]);
        },
        
        resizeTaskGrid: function(height, width){
        	this.tasksGrid.enableAutoHeight(true, height);
        	this.tasksGrid.enableAutoWidth(true, width);
        	this.tasksGrid.setSizes();
        },
        
        changeDisplayTaskGridColumn: function(checkbox){
        	var colIndex = 0;
        	for(i=0; i<this.tasksGrid.getColumnsNum(); i++){
        		var colLabel=this.tasksGrid.getColLabel(i);
        		if(colLabel == checkbox.value){
        			colIndex = i;
        		}
        	}
        	
        	 if (checkbox.checked) {
                 this.tasksGrid.setColumnHidden(colIndex,false);
             }
             else {
                 this.tasksGrid.setColumnHidden(colIndex,true);
             }        	
        	
        }

    };

}();