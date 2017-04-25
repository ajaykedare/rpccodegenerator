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