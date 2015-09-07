/**
Boxes Module
**/
var Boxes = function () {

    // private functions & variables

    var _initComponents = function() {
        
    }

    // public functions
    return {

        //main function
        init: function () { 
        
        },
        
        expandAllTree: function(){
        	$("#tree-boxes").jstree("open_all");  
        },
        
        collapseAllTree: function(){
        	$("#tree-boxes").jstree("close_all");  
        },

      //Widget - can create...
        //Boxes - boxes, projects, tasks
        //Projects - boxes, projects, tasks
        //Tasks - none
        createNewBox: function(){
        	var tree = $("#tree-boxes").jstree(true);
        	var parent = tree.get_selected(true);
        	if(parent[0].icon == "icon-doc"){
        		alert("error: Please select a Box or a Project");
        	}else{
	        	var node = tree.create_node(parent[0].id, {
	                "text": "New Box",
	                "icon": "icon-briefcase"
	            });
	            tree.edit(node);
	         }
        },

        createNewProject: function(){
        	var tree = $("#tree-boxes").jstree(true);
        	var parent = tree.get_selected(true);
        	if(parent[0].icon == "icon-doc"){
        		alert("error: Please select a Box or a Project");
        	}else{
	        	var node = tree.create_node(parent[0].id, {
	                "text": "New Project",
	                "icon": "icon-folder-alt"
	            });
	            tree.edit(node);
        	}
        },

        createNewTask: function(){
        	var tree = $("#tree-boxes").jstree(true);
        	var parent = tree.get_selected(true);
        	if(parent[0].icon == "icon-doc"){
        		alert("error: Please select a Box or a Project");
        	}else{
	        	var node = tree.create_node(parent[0].id, {
	                "text": "New Task",
	                "icon": "icon-doc"
	            });
	            tree.edit(node);
        	}
        },

    };

}();