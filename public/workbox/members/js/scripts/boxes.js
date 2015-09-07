/**
Boxes Module
**/
var Boxes = function () {

    // private functions & variables

    var _initComponents = function() {
    	var boxWidgetsTree = dhtmlXTreeFromHTML("boxes_tree"); 
    	var boxesMenu = new dhtmlXMenuObject();
    	boxesMenu.setIconsPath("js/scripts/img/");
    	boxesMenu.renderAsContextMenu();
    	boxesMenu.attachEvent("onClick", onBoxesMenuClick);
    	boxesMenu.loadStruct("js/scripts/xml/boxes-menu.xml");
    	
    	boxWidgetsTree.enableContextMenu(boxesMenu);
		boxWidgetsTree.enableHighlighting(true);
		boxWidgetsTree.enableMultiselection(false);
		boxWidgetsTree.enableDragAndDrop(true);
		boxWidgetsTree.enableItemEditor(false);
		boxWidgetsTree.attachEvent("onDrop",onReorder);
		boxWidgetsTree.attachEvent("onDblClick",function(id){
	    	document.location.href = boxWidgetsTree.getUserData(id,"href");
		});
		boxWidgetsTree.attachEvent("onEdit", function(state, id, tree, value){
		    if(state == 3){
		    	boxWidgetsTree.enableItemEditor(false);
		    }
		    return true
		});
		
    	function onReorder(r1, r2){
    		//save reorder
    	}
		
    	//Widget - can create...
        //Boxes - boxes, projects, tasks
        //Projects - boxes, projects, tasks
        //Tasks - none
		function onBoxesMenuClick(menuitemId,type){
			var id = boxWidgetsTree.contextID;
			switch(menuitemId){
				case "view":
					document.location.href = boxWidgetsTree.getUserData(id,"href");
				break;
				case "createBox":
					var scope = angular.element(document.getElementById("MetronicApp")).scope();
//				    scope.$apply(function () {
				    	scope.createBox();
//				    });Äì
//					var d=new Date(); 
//					boxWidgetsTree.insertNewItem(id,d.valueOf(),"New Box",0,"box.gif","box-open.gif","box.gif",'SELECT'); 
				break;
				case "createProject":
					var d=new Date(); 
		        	boxWidgetsTree.insertNewItem(id,d.valueOf(),"New Project",0,"project.gif","project-open.gif","project.gif",'SELECT'); 
				break;
				case "createTask":
					var d=new Date(); 
					boxWidgetsTree.insertNewItem(id,d.valueOf(),"New Task",0,"doc.gif","doc.gif","doc.gif",'SELECT'); 
				break;
				case "rename":
					boxWidgetsTree.enableItemEditor(true);
					boxWidgetsTree.editItem(id);
				break;
				case "remove":
					boxWidgetsTree.deleteItem(id);
				break;
			}
			return true
		}
		
	     var boxWidgetData = {
	    		 id:0,
	    	    item:[ {id:"1",text:"Box 1", im0:"box.gif", im1:"box-open.gif", im2:"box.gif",userdata:[{name:"href", content:"#/boxes/box"}],
	    	    	child:"1",
	    	      item:[{id:"11", text:"Project ABC", im0:"project.gif", im1:"project-open.gif", im2:"project.gif",userdata:[{name:"href", content:"#/boxes/project"}],
	    	    	  child:"11",
	    	       item:[{id:"111", text:"Task ABC", im0:"doc.gif", im1:"doc.gif", im2:"doc.gif",userdata:[{name:"href", content:"#/boxes/task"}]},
	    	             {id:"112", text:"Task XYZ", im0:"doc.gif", im1:"doc.gif", im2:"doc.gif",userdata:[{name:"href", content:"#/boxes/task"}]}
	    	             ]},
	    	             {id:"12", text:"Box 1.2", im0:"box.gif", im1:"box-open.gif", im2:"box.gif",userdata:[{name:"href", content:"#/boxes/box"}],
	    	            	 child:"12",
	    	       item:[{id:"121", text:"Project dev", im0:"project.gif", im1:"project-open.gif", im2:"project.gif",userdata:[{name:"href", content:"#/boxes/project"}],child:"121",
	    	    	   item:[{id:"1211", text:"Task dev", im0:"doc.gif", im1:"doc.gif", im2:"doc.gif",userdata:[{name:"href", content:"#/boxes/task"}]},
	    	             {id:"1212", text:"Task test", im0:"doc.gif", im1:"doc.gif", im2:"doc.gif",userdata:[{name:"href", content:"#/boxes/task"}]}
	    	             ]},
	    	          ]},
	    	          {id:"2", text:"Box 2", im0:"box.gif", im1:"box-open.gif", im2:"box.gif",userdata:[{name:"href", content:"#/boxes/box"}],
	    	        	  child:"1",
	    	      item:[
	    	          {id:"21", text:"Box 2.1", im0:"box.gif", im1:"box-open.gif", im2:"box.gif",userdata:[{name:"href", content:"#/boxes/box"}]}
	    	      ]},
	    	      
	    	      
	    	      {id:"3",text:"Box 3", im0:"box.gif", im1:"box-open.gif", im2:"box.gif",userdata:[{name:"href", content:"#/boxes/box"}],
	    	    	  child:"3",
	    	      item:[{id:"31", text:"Project One", im0:"project.gif", im1:"project-open.gif", im2:"project.gif",userdata:[{name:"href", content:"#/boxes/project"}],
	    	    	  child:"31",
	    	       item:[{id:"311", text:"Task 1", im0:"doc.gif", im1:"doc.gif", im2:"doc.gif",userdata:[{name:"href", content:"#/boxes/task"}]},
	    	             {id:"312", text:"Task 2", im0:"doc.gif", im1:"doc.gif", im2:"doc.gif",userdata:[{name:"href", content:"#/boxes/task"}]},
	    	             {id:"313", text:"Task 3", im0:"doc.gif", im1:"doc.gif", im2:"doc.gif",userdata:[{name:"href", content:"#/boxes/task"}]},
	    	             {id:"314", text:"Task 4", im0:"doc.gif", im1:"doc.gif", im2:"doc.gif",userdata:[{name:"href", content:"#/boxes/task"}]},
	    	             {id:"315", text:"Task 5", im0:"doc.gif", im1:"doc.gif", im2:"doc.gif",userdata:[{name:"href", content:"#/boxes/task"}]}
	    	             ]}
	    	            ]}
	    	      ]}]};
//	    	             ]},
//	    	          ]}
//	     ]}};
	     
	/*     
         'data': [{
                 "text": "Box 1.1",
                 "icon": "icon-briefcase",
                 "state": {
                     "opened": true
                 },
                 "children": [
                     {
                     	"text": "Project dev", "icon": "icon-folder-alt",
                     	"children": [{
                             "text": "Task dev",
                             "icon": "icon-doc"
                         
                         }] },
                    {
                     	"text": "Project test", "icon": "icon-folder-alt",
                     	"children": [{
                             "text": "Task test",
                             "icon": "icon-doc"
                         
                         }] }
                 ]
             }, {
                 "text": "Box 1.2",
                 "icon": "icon-briefcase",
                 "state": {
                     "opened": true
                 },
                 "children": [
                     {
                     	"text": "Project dev", "icon": "icon-folder-alt",
                     	"children": [{
                             "text": "Task dev",
                             "icon": "icon-doc"
                         }] },
                    {
                     	"text": "Project test", "icon": "icon-folder-alt",
                     	"children": [{
                             "text": "Task test",
                             "icon": "icon-doc"
                         

 
 */
	     boxWidgetsTree.loadJSONObject(boxWidgetData); 
	     boxWidgetsTree.openAllItems("1");
	     return boxWidgetsTree;
    }

    // public functions
    return {

        //main function
        init: function () { 
//        	this.boxesTree = _initComponents();
        },
        
        expandAllTree: function(){
        	this.boxesTree.openAllItems(0);
        },
        
        collapseAllTree: function(){
        	this.boxesTree.closeAllItems(0);
        },

      //Widget - can create...
        //Boxes - boxes, projects, tasks
        //Projects - boxes, projects, tasks
        //Tasks - none
        createNewBox: function(){
        	var d=new Date();
        	var id = 0;
        	if(this.boxesTree.getSelectedItemId() > 0){
        		id = this.boxesTree.getSelectedItemId();
        	}else{
        		id = "1";
        	}
        	
        	this.boxesTree.insertNewNext(id,d.valueOf(),"New Box",0,"box.gif","box-open.gif","box.gif",'SELECT'); 
        },

        createNewProject: function(){
        	var d=new Date();
        	var id = 0;
        	if(this.boxesTree.getSelectedItemId() > 0){
        		id = this.boxesTree.getSelectedItemId();
        	}else{
        		id = "1";
        	}
        	this.boxesTree.insertNewNext(id,d.valueOf(),"New Project",0,"project.gif","project-open.gif","project.gif",'SELECT'); 
        },

        createNewTask: function(){
        	var d=new Date();
        	var id = 0;
        	if(this.boxesTree.getSelectedItemId() > 0){
        		id = this.boxesTree.getSelectedItemId();
        	}else{
        		id = "1";
        	}
        	this.boxesTree.insertNewNext(id,d.valueOf(),"New Task",0,"doc.gif","doc.gif","doc.gif",'SELECT'); 
        
		}

    };

}();