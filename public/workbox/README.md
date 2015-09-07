A quick and dirty guide for Angular. It could use more details and is slightly opinionated.

###Services
Angular Factory vs Service vs Provider explained
Services are angular's way of interacting with API's through $http, or sharing code between views never re-write a function in two seperate controllers move it to a shared service

<b>Factory:</b> Returns an object that persists in memory throughout the life of the application.
<pre><code>	app.factory('myService', function(){
	var _privateVariable = 'not accesible outside of the factory'
	return {
      	getData: function(){...}
      }
    });
</code></pre>

<b>Service:</b> Is a contructor that returns a new object each time it is called. Uses this.
<pre><code>	app.service('myService', function(){
	var _privateVariable = 'not accesible outside of the service'
	    	this.getData = function(){...}
    });
</code></pre>

<b>Provider:</b> Similar to a factory howerver providers are all registered prior to execution of app.config so you can inject a provider into the config function. Also it is usually best to use the word provider in the name of this service. <i>exp. $stateProvider, $urlRouterProvider</i>
<pre><code>	app.provider('myProviderService', function(){
		//usually setup things like xhr Interceptors or app constants
    })
</code></pre>

###Folder Structure
<a href="https://scotch.io/tutorials/angularjs-best-practices-directory-structure">Thanks scotch.io</a>
<pre><code>app/
----- shared/   // acts as reusable components or partials of our site
---------- sidebar/  //group js and html files by component
--------------- sidebarDirective.js
--------------- sidebarView.html
---------- article/
--------------- articleDirective.js
--------------- articleView.html
----- components/   // each component is treated as a mini Angular app
---------- home/
--------------- homeController.js
--------------- homeService.js
--------------- homeView.html
---------- blog/
--------------- blogController.js
--------------- blogService.js
--------------- blogView.html
----- app.module.js
----- app.routes.js
assets/
----- img/      // Images and icons for your app
----- css/      // All styles and style related files (SCSS or LESS files)
----- js/       // JavaScript files written for your app that are not for angular
----- libs/     // Third-party libraries such as jQuery, Moment, Underscore, etc.
index.html
</code></pre>

###jQuery

jquery belongs in the link function of a directive. Please do not load it directly in the html or controllers. Technically it is not a best practice to perform all xhr requests from a service and not in a directive itself but then the directive is not self contained.

<pre><code>var app = angular.module('jquery.zipAuto', []);

app.directive('jqueryZipAuto', function(){
  return {
    restrict: 'AE',
    link: function(scope, element, attrs){
      //assuming jquery is globally accessible
      var zip = $('#zipcode');
      zip.bind('keyup', function(){
        if(zip.val().length === 5){
          $.ajax({
          url: 'http://api.zippopotam.us/us/' + zip.val(),
          method: 'GET',
          success: function(response){
            $('#city').text(response.places[0]['place name']);
            $('#state').text(response.places[0]['state abbreviation']);
          },
          error: function(err){
          	console.log(err);
        }
    });
  }
});

</code></pre>

<b>Same Directive without using jQuery</b>

<pre><code>var app = angular.module('getZip', []);

app.directive('zipAuto', function($http, $q){
	return {
		restrict: 'AE',
		scope: {
			zip: '=',
			city: '=',
			state: '='
		},
		link: function(scope, element, attrs){
			element.bind('keyup', function(){
				if(scope.zip && scope.zip.length === 5){
					return $http({
						url: "http://api.zippopotam.us/us/" + scope.zip,
	                	cache: false,
	                	dataType: "json",
	                	type: "GET"
					}).then(function(response){
						scope.city = response.data.places[0]['place name'];
						scope.state = response.data.places[0]['state abbreviation'];
					});
				}
				if (scope.zip && (scope.zip.length < 5 || scope.zip.length > 5)) {
					scope.city = '';
					scope.state = '';
				}
			});
		}
	}
});
</code></pre>

###Naming Conventions

<b>Controllers:</b> UpperCamelCase
<pre><code>	app.controller('MyController', ...)
</code></pre>

<b>Services:</b> lowerCamelCase
<pre><code>	app.factory('myService', ...)
</code></pre>

<b>Directives:</b> lowerCamelCase ==> snake-case
<pre><code>/*javascript uses lowerCamelCase
* however when angular registers
* the directive it will force it
* to snake case for use in html
*/
	app.directive('myDirective', ...)
    < my-directive></ my-directive>
</code></pre>

###Don't Chain create files

<pre><code>angular.module('myApp', [])
	.controller('MyController', function(){
    })
    .service('myService', function(){
    })
    .directive('myDirective', function(){
    })
</code></pre>

<b>Each file loads the module on an app variable </b>

<pre><code>var app = angular.module('myApp');
app.controller('MyController', ...)
</code></pre>

###General Practices
- single quotes in JavaScript
- double quotes in html
- lowerCamelCase JavaScript variables
- UpperCamelCase JavaScript constructors
- snake-case css classes
- Do not use html id's for styles
- Avoid dynamically setting styles with JavaScript change className instead
- Prepend data to all ng-directives --> data-ng-view
