/**
Project Module
**/
var Project = function () {

    // private functions & variables
    
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
        	
        	this.activitiesGrid = createActivitiesGrid();
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