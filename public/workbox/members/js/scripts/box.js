/**
Box Module
**/
var Box = function () {

    // private functions & variables

    var createRoadmap = function() {
    	var tasks =  {
                data:[
                    {id:1, text:"Project #2", start_date:"01-04-2015", end_date:"25-04-2015", owner:"User 1",duration:18,order:10,
                        progress:0.4, open: true},
                    {id:2, text:"Task #1", 	  start_date:"02-04-2015", end_date:"05-04-2015", owner:"User 3",duration:8, order:10,
                        progress:0.6, parent:1},
                    {id:3, text:"Task #2",    start_date:"11-04-2015", end_date:"21-04-2015", owner:"User 2",duration:8, order:20,
                        progress:0.6, parent:1}
                ],
                        links:[
                { id:1, source:1, target:2, type:"1"},
                { id:2, source:2, target:3, type:"0"},
                { id:3, source:3, target:4, type:"0"},
                { id:4, source:2, target:5, type:"2"},
            ]
            };

			gantt.templates.scale_cell_class = function(date){
			    if(date.getDay()==0||date.getDay()==6){
			        return "weekend";
			    }
			};
			gantt.templates.task_cell_class = function(item,date){
			    if(date.getDay()==0||date.getDay()==6){ 
			        return "weekend" ;
			    }
			};

			gantt.templates.rightside_text = function(start, end, task){
				if(task.type == gantt.config.types.milestone){
					return task.text;
				}
				return "";
			}

			gantt.config.columns = [
			    {name:"text",       label:"Name",  width:"*", tree:false,width:80, resize:true },
			    {name:"start_date",   label:"Start Date",  template:function(obj){
					return gantt.templates.date_grid(obj.start_date);
			    }, align: "center", width:80, resize:true },
			    {name:"end_date",   label:"End Date",  template:function(obj){
					return gantt.templates.date_grid(obj.end_date);
			    }, align: "center", width:80, resize:true },
			    {name:"owner",   label:"Owner", align:"center", width:80, resize:true}
			];

			gantt.config.grid_width = 390;
			gantt.config.grid_resize = true;
			gantt.config.date_grid = "%F %d"
			gantt.config.scale_height  = 60;
			gantt.config.sort = true;
			gantt.config.subscales = [
				{ unit:"week", step:1, date:"Week #%W"}
			];
			gantt.init("gantt_roadmap");

			gantt.parse(tasks);
			return gantt;
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
    	projectsGrid.setInitWidths("75,200,100,150,100,100,100,100,100,100");          //the widths of columns  
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
        
    var createActivitiesGrid = function (){
//    	Property Changed,Description of Change,Value Before Change,Value After Change,Creator,Date Created
    	/*Activities Widget Grid */
    	var activitiesGrid = new dhtmlXGridObject('gridbox-activities');
    	
    	activitiesGrid.setImagePath("js/scripts/img/");          //the path to images required by grid 
    	activitiesGrid.setHeader("Property Changed,Description of Change,Value Before Change,Value After Change,Creator,Date Created");//the headers of columns  
    	activitiesGrid.setInitWidths("125,150,150,150,150,150");          //the widths of columns  
    	activitiesGrid.setColAlign("left,left,left,left,left,left");       //the alignment of columns   
    	activitiesGrid.setColTypes("ro,ro,ro,ro,ro,ro");                //the types of columns  
    	activitiesGrid.setColSorting("str,str,str,str,str,str");          //the sorting types   
    	activitiesGrid.enableMultiselect(false);
    	activitiesGrid.enableDragAndDrop(false);
    	activitiesGrid.enableAutoHeight(true);
    	activitiesGrid.enableAutoWidth(true);
    	activitiesGrid.enableColumnAutoSize(true);
    	activitiesGrid.init();      //finishes initialization and renders the grid on the page     

    	for(k=4; k<6; k++){
    		activitiesGrid.setColumnHidden(k,true);
    	}
    	
    	var data={
    		    rows:[
    		        { id:4, data: ["Name", "update", "Task 0", "Task 1"]},
    		        { id:2, data: ["Owner", "assign", "User 1", "User 2"]},
    		        { id:3, data: ["Description", "update", "this task", "a task"]},
    		        { id:1, data: ["Status", "assign", "in progress", "completed"]}
    		    ]
    		};
    	activitiesGrid.parse(data,"json"); //takes the name and format of the data source

    	
    	return activitiesGrid;
    }

    // public functions
    return {

        //main function
        init: function () {
        	
        	this.gantt = createRoadmap();
        	
        	this.projectsGrid = createProjectsGrid();
        	this.activitiesGrid = createActivitiesGrid();
        },
        
        resizeRoadmap: function(height, width){
        	this.gantt.height = height;
        	this.gantt.width = width
        	this.gantt.setSizes();
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
        
        resizeActivitiesGrid: function(height, width){
        	this.activitiesGrid.enableAutoHeight(true, height);
        	this.activitiesGrid.enableAutoWidth(true, width);
        	this.activitiesGrid.setSizes();
        },
        
        changeDisplayActivitiesGridColumn: function(checkbox){
        	var colIndex = 0;
        	for(i=0; i<this.activitiesGrid.getColumnsNum(); i++){
        		var colLabel=this.activitiesGrid.getColLabel(i);
        		if(colLabel == checkbox.value){
        			colIndex = i;
        		}
        	}
        	
        	 if (checkbox.checked) {
                 this.activitiesGrid.setColumnHidden(colIndex,false);
             }
             else {
                 this.activitiesGrid.setColumnHidden(colIndex,true);
             }        	
        },
        
        exportActivitiesReport: function(){
        	
        }
       
    };

}();