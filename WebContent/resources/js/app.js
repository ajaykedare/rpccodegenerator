var codeGeneratorApp = angular.module('codeGeneratorApp',['ngRoute','ngAnimate', 'ngSanitize', 'ui.bootstrap']);


codeGeneratorApp.config(['$routeProvider', function($routeProvider){	
	$routeProvider
	.when('/',{
		templateUrl:'resources/templates/home.html',
		controller:'MainCtrl'
	})		
	.otherwise({
		redirectTo : '/'
	});

} ]);

codeGeneratorApp.directive('drawCircle', function() {
    return {
      scope: {
        x: '@x',
        y: '@y'
      },
      link: function(scope, element, attrs) {
        var x = parseInt(scope.x);
        var y = parseInt(scope.y);
        var canvas = element.parent();
        var ctx = canvas[0].getContext("2d");
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, 2 * Math.PI, false);
        ctx.lineWidth = 0.2;
        ctx.stroke();
        ctx.fill();
      }
    }
  });