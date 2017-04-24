
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
	$scope.user={};
	$scope.message="";
	$scope.data={};
	$scope.data= {
			  "methods": [
				    {
				      "methodname": "addition",
				      "parameters" : [
				          {
				            "name":"var_a",
				            "type":"int"
				          },
				          {
				            "name":"var_b",
				            "type":"int"
				          }
				        ],
				        "returntype":"int"
				    },
				    {
				      "methodname": "delete",
				      "parameters" : [
				          {
				            "name":"varb",
				            "type":"int"
				          }
				        ],
				        "returntype":"int"
				    }
				    
				  ],
				  "canvasdata": {
				    "rectangles": [
				      {
				        "x": 50,
				        "y": 200,
				        "l": 50,
				        "b": 50
				      },
				      {
				        "x": 200,
				        "y": 200,
				        "l": 50,
				        "b": 50
				      }
				    ],
				    "lines": [
				      {
				        "cpx": 150,
				        "cpy": 150,
				        "epx": 225,
				        "epy": 225
				      },
				      {
				        "cpx": 150,
				        "cpy": 100,
				        "epx": 225,
				        "epy": 225
				      }
				    ]
				  }
				}
	$scope.data.canvasdata={"rectangles":[{"x":50,"y":200,"l":50,"b":50},{"x":200,"y":200,"l":50,"b":50}],"lines":[{"cpx":150,"cpy":150,"epx":225,"epy":225},{"cpx":150,"cpy":100,"epx":225,"epy":225}]};
	
	
				
	//TODO: Add any initial checking code here, 
	if(!$scope.mainService.isInitialised)
	{
		MainService.isInitialised=true;
		
		if(!$sessionService.getObject("user")) {
			$location.path('/');
		} else {
			$location.path('/dashboard');
			$scope.mainService.currentUser=$sessionService.getObject("user");
	    	$scope.mainService.isUserLoggedIn=true;
		}
        /*if(!$scope.mainService.isUserLoggedIn){
        	
        	$location.path('/');
        }*/
	}
	
	$scope.addMethod = function() {
		
		$scope.newMethod = {"parameters":[]};
		$scope.uibModalInstance = $uibModal.open({
		        templateUrl: 'resources/templates/addMethodModal.html',
		        controller: 'ModalCtrl',
		        scope: $scope
		 });
	};
	
	
	$scope.deleteMethod = function() {
		
		$scope.methodToDelete = {};
		$scope.uibModalInstance = $uibModal.open({
		        templateUrl: 'resources/templates/deleteMethodModal.html',
		        controller: 'ModalCtrl',
		        scope: $scope
		 });
	};
	

	$scope.drawCurve = function() {
		
		$scope.drawCanvas();
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
	$scope.generateCode = function(){
			
		$scope.data="";

		var result = $http({
			method : 'POST',
			url : 'generateCode',
			data : angular.toJson($scope.data),
		});
		result.success(function(data,status) {
			if(data.result=="Success")
		    {
		    	alert('Method generated successfully !');
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

codeGeneratorApp.controller("ModalCtrl", function($scope,  $http, $uibModalInstance) {

	$scope.cancel = function() {
	    $uibModalInstance.dismiss();
	};
	
	$scope.addParameter = function () {
		$scope.newMethod.parameters.push({ 
          name: "",
          type: "",
          namePlaceholder: "Enter Parameter name",
          typePlaceholder: "Enter Parameter type"
        });
		alert("added parameter")
      };
      
      $scope.removeParameter = function(idx) {
    	  $scope.newMethod.parameters.splice(idx, 1);
      };
      
      $scope.addMethod = function() {
  		
  		$scope.data.methods.push($scope.newMethod)
  		alert("New Method Object :"+ angular.toJson($scope.newMethod));
  		alert("Old global object :" + angular.toJson($scope.data));
  		
  		$uibModalInstance.close();
  	};
  	
  	$scope.deleteMethod = function() {
  		alert("Method to delete is : "+ angular.toJson($scope.methodToDelete));
  		
  		$uibModalInstance.close();
  	
  	};
	

	
});