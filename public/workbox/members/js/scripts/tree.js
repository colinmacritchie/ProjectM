(function() {
  'use strict';

  angular.module('treeApp', ['ui.tree'])
  .controller('treeCtrl', function($scope) {

    $scope.remove = function(scope) {
      scope.remove();
    };

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    $scope.moveLastToTheBegginig = function () {
      var a = $scope.data.pop();
      $scope.data.splice(0,0, a);
    };

    $scope.newSubItem = function(scope) {
      var nodeData = scope.$modelValue;
      nodeData.nodes.push({
        id: nodeData.id * 10 + nodeData.nodes.length,
        title: nodeData.title + '.' + (nodeData.nodes.length + 1),
        nodes: []
      });
    };

    var getRootNodesScope = function() {
      return angular.element(document.getElementById("tree-root")).scope();
    };

    $scope.collapseAll = function() {
      var scope = getRootNodesScope();
      scope.collapseAll();
    };

    $scope.expandAll = function() {
      var scope = getRootNodesScope();
      scope.expandAll();
    };

    $scope.data = [{
      "id": 1,
      "title": "box 1",
      "nodes": [
        {
          "id": 11,
          "title": "box 1.1",
          "nodes": [
            {
              "id": 111,
              "title": "box 1.1.1",
              "nodes": []
            }
          ]
        },
        {
          "id": 12,
          "title": "box 1.2",
          "nodes": []
        }
      ],
    }, {
      "id": 2,
      "title": "box 2",
      "nodes": [
        {
          "id": 21,
          "title": "box 2.1",
          "nodes": []
        },
        {
          "id": 22,
          "title": "box 2.2",
          "nodes": []
        }
      ],
    }, {
      "id": 3,
      "title": "box 3",
      "nodes": [
        {
          "id": 31,
          "title": "box 3.1",
          "nodes": []
        }
      ],
    }, {
      "id": 4,
      "title": "box 4",
      "nodes": [
        {
          "id": 41,
          "title": "box 4.1",
          "nodes": []
        }
      ],
    }];
  });

})();