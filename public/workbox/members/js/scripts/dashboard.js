/**
Dashboard Module
**/
var Dashboard = function () {

    // private functions & variables

    var createRoadmap = function() {
    	gantt1 = Gantt.getGanttInstance();
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

			gantt1.templates.scale_cell_class = function(date){
			    if(date.getDay()==0||date.getDay()==6){
			        return "weekend";
			    }
			};
			gantt1.templates.task_cell_class = function(item,date){
			    if(date.getDay()==0||date.getDay()==6){ 
			        return "weekend" ;
			    }
			};

			gantt1.templates.rightside_text = function(start, end, task){
				if(task.type == gantt1.config.types.milestone){
					return task.text;
				}
				return "";
			}

			gantt1.config.columns = [
			    {name:"text",       label:"Name",  width:"*", tree:false,width:80, resize:true },
			    {name:"start_date",   label:"Start Date",  template:function(obj){
					return gantt1.templates.date_grid(obj.start_date);
			    }, align: "center", width:80, resize:true },
			    {name:"end_date",   label:"End Date",  template:function(obj){
					return gantt1.templates.date_grid(obj.end_date);
			    }, align: "center", width:80, resize:true },
			    {name:"owner",   label:"Owner", align:"center", width:80, resize:true}
			];

			gantt1.config.grid_width = 390;
			gantt1.config.grid_resize = true;
			gantt1.config.date_grid = "%F %d"
			gantt1.config.scale_height  = 60;
			gantt1.config.sort = true;
			gantt1.config.subscales = [
				{ unit:"week", step:1, date:"Week #%W"}
			];
			gantt1.init("gantt_roadmap");

			gantt1.parse(tasks);
			return gantt1;
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
        	
        	this.gantt1 = createRoadmap();
        	this.activitiesGrid = createActivitiesGrid();
        },
        
        resizeRoadmap: function(height, width){
        	this.gantt1.height = height;
        	this.gantt1.width = width
        	this.gantt1.setSizes();
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
        	
        },
        
        
        exportCalendar: function(){
        	
        }
       
    };

}();