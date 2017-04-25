
codeGeneratorApp.factory('MainService',['$http','$rootScope','$q', function(http,rootScope,q){
	var newService = new MainService(http,rootScope,q);
	return newService;
}]);



codeGeneratorApp.factory('$sessionService',['$window', function($window){
	return {
	    set: function(key, value) {
	      $window.localStorage[key] = value;
	    },
	    get: function(key, defaultValue) {
	      return $window.localStorage[key] || false;
	    },
	    setObject: function(key, value) {
	      $window.localStorage[key] = JSON.stringify(value);
	    },
	    getObject: function(key) {
	      if($window.localStorage[key] != undefined){
	        return JSON.parse( $window.localStorage[key] || false );
	      }
	      return false;   
	    },
	    remove: function(key){
	      $window.localStorage.removeItem(key);
	    },
	    clear: function(){
	      $window.localStorage.clear();
	    }
	  }
}]);


codeGeneratorApp.controller("MainCtrl", function($scope, $http, $location, $q, MainService, $uibModal,$sessionService) {
	$scope.mainService=MainService;
	
	$scope.templateData = {"program_name":"test_rpc","version":"1","methods":[],"data_structures":[],"canvasdata":{"rectangles":[{"x":50,"y":175,"l":50,"b":50},{"x":500,"y":175,"l":50,"b":50}],"lines":[]}};
	
	
				
	//TODO: Add any initial checking code here, 
	if(!$scope.mainService.isInitialised)
	{
		MainService.isInitialised=true;
		
		if(!$sessionService.getObject("data")) {
			
			$sessionService.setObject("data",$scope.templateData);
			$scope.data=$sessionService.getObject("data");
			
		} else {			
			$scope.data=$sessionService.getObject("data");
			
		}       
	}
	
	$scope.reset = function() {
		$sessionService.remove("data");
		$sessionService.setObject("data",$scope.templateData);
		$scope.data=$sessionService.getObject("data");
		$scope.drawCanvas
	};	
	$scope.addMethod = function() {
		
		$scope.newMethod = {"parameters":[]};
		$scope.uibModalInstance = $uibModal.open({
		        templateUrl: 'resources/templates/addMethodModal.html',
		        controller: 'ModalCtrl',
		        scope: $scope
		 });
	};	
	
	$scope.setLines = function() {
		$scope.data.line=[];
  		for (var i = 0; i<$scope.data.methods.length; i++) {
  			line = {};
  	  		line.cpx=300;
  	  		line.cpy = (400/($scope.data.methods.length+1))*(i+1);
  	  		line.epx=525;
  	  		line.epy=200;
  	  		$scope.data.line.push(line); 	  		
  		}
  		
  		$scope.drawCanvas();
	};
	
	$scope.deleteMethod = function() {
		
		$scope.methodToDelete = {};
		$scope.customStructureTypeToDelete = {};
		$scope.uibModalInstance = $uibModal.open({
		        templateUrl: 'resources/templates/deleteMethodModal.html',
		        controller: 'ModalCtrl',
		        scope: $scope
		 });
	};
	
	$scope.addCustomStructureType = function() {
		
		$scope.newCustomStructureType = {"members":[]};
		$scope.uibModalInstance = $uibModal.open({
		        templateUrl: 'resources/templates/addCustomStructureTypeModal.html',
		        controller: 'ModalCtrl',
		        scope: $scope
		 });
	};	

	
	$scope.drawCanvas = function(){
		var canvas = document.getElementById('mycanvas');
		var context = canvas.getContext('2d');
		context.globalAlpha = 1.0;
		context.beginPath();
		
		angular.forEach($scope.data.canvasdata.rectangles, function(value, key){
			context.beginPath();
			context.fillStyle = 'blue';
			context.fillRect(value.x, value.y, value.l, value.b);
		});
		
		angular.forEach($scope.data.canvasdata.lines, function(value, key){
			context.beginPath();
			context.moveTo(75, 225);
			context.quadraticCurveTo(value.cpx, value.cpy, value.epx, value.epy);
			context.strokeStyle = "black";
			context.stroke();
		});
	}
	
	$scope.generateMethod = function(){
			
		
		var result = $http({
			method : 'POST',
			url : 'generateCode',
			data : angular.toJson($scope.data),
		});
		result.success(function(data,status) {
			if(data.result=="Success")
		    {
		    	alert('Method generated successfully Stored at \n!'+data.path);
		    	$uibModalInstance.close();
		    }
		    else
		    {
		    	console.log('Internal server error occured while generating code with status :'+status);
		    	
		    }
		  });
		result.error(function (data, status){
			console.log('Error Occured in AJAX call with status :'+status);
		});	
	};	
});