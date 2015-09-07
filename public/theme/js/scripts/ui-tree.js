var BoxTree = function () {

    var createBoxesTree = function() {

        $("#tree-boxes").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                }, 
                // so that create works
                "check_callback" : true,
                'data': [{
                        "text": "Box 1",
                        "icon": "icon-briefcase",
                        "children": [{
                            "text": "Project ABC",
                            "icon": "icon-folder-alt",
                            "state": {
                                "selected": true
                            }
                        }, {
                            "text": "Task XYZ",
                            "icon": "icon-doc"
                        }, {
                            "text": "Box 1.1",
                            "icon": "icon-briefcase",
                            "state": {
                                "opened": true
                            },
                            "children": [
                                {"text": "Project test", "icon": "icon-folder-alt"}
                            ]
                        }, {
                            "text": "Task test",
                            "icon": "icon-doc"
                        
                        }, {
                            "text": "Project  One",
                            "icon": "icon-folder-alt",
                            "children": [
                                {"text": "Task 1", "icon" : "icon-doc"},
                                {"text": "Task 2", "icon" : "icon-doc"},
                                {"text": "Task 3", "icon" : "icon-doc"},
                                {"text": "Task 4", "icon" : "icon-doc"},
                                {"text": "Task 5", "icon" : "icon-doc"}
                            ]
                        }]
                    },
                    {"text":"Box 2",
                    "icon": "icon-briefcase"}
                ]
            },
            "contextmenu":{         
                "items": function($node) {
                    var tree = $("#tree-boxes").jstree(true);
                    return {
                    	"Create Box": {
                            "separator_before": false,
                            "separator_after": false,
                            "label": "Create Box",
                            "action": function (obj) { 
                                $node = tree.create_node($node, {
                                    "text": "New Box",
                                    "icon": "icon-briefcase"
                                });
                                tree.edit($node);
                            }
                        },
                    	"Create Project": {
                            "separator_before": false,
                            "separator_after": false,
                            "label": "Create Project",
                            "action": function (obj) { 
                                $node = tree.create_node($node, {
                                    "text": "New Project",
                                    "icon": "icon-folder-alt"
                                });
                                tree.edit($node);
                            }
                        },
                        "Create Task": {
                            "separator_before": false,
                            "separator_after": false,
                            "label": "Create Task",
                            "action": function (obj) { 
                                $node = tree.create_node($node, {
                                    "text": "New Task",
                                    "icon": "icon-doc"
                                });
                                tree.edit($node);
                            }
                        },
                        "Rename": {
                            "separator_before": false,
                            "separator_after": false,
                            "label": "Rename",
                            "action": function (obj) { 
                                tree.edit($node);
                            }
                        },                         
                        "Remove": {
                            "separator_before": false,
                            "separator_after": false,
                            "label": "Remove",
                            "action": function (obj) { 
                                tree.delete_node($node);
                            }
                        }
                    };
                }
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state" : { "key" : "demo2" },
            "plugins" : [ "contextmenu", "dnd", "state", "types" ]
        });
    
    }

    var createBoxesNav = function () {

        $("#tree-nav").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                }, 
                // so that create works
                "check_callback" : true,
                'data': [{
                        "text": "Box 1",
                        "icon": "icon-briefcase",
                        "children": [{
                            "text": "Box 1.1",
                            "icon": "icon-briefcase",
                            "state": {
                                "opened": true
                            },
                            "children": []
                        },{
                            "text": "Box  A",
                            "icon": "icon-briefcase",
                            "children": [
                                {"text": "Box 1a", "icon" : "icon-briefcase"},
                                {"text": "Box 2a", "icon" : "icon-briefcase"},
                                {"text": "Box 3a", "icon" : "icon-briefcase"},
                                {"text": "Box 4a", "icon" : "icon-briefcase"},
                                {"text": "Box 5a", "icon" : "icon-briefcase"}
                            ]
                        }]
                    },
                    {"text":"Box 2",
                    "icon": "icon-briefcase"}
                ]
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state" : { "key" : "demo2" },
            "plugins" : [ "state", "types" ]
        });
        
     // handle link clicks in tree nodes(support target="_blank" as well)
        $('#tree-nav').on('select_node.jstree', function(e,data) { 
                document.location.href = "#/boxes";
        });
    }
    

    return {
        //main function to initiate the module
        init: function () {
        	createBoxesTree();
        	
        	createBoxesNav();

        }

    };

}();