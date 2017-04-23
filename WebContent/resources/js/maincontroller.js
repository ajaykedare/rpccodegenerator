
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

	$scope.drawCurve = function() {
		
		$scope.drawCanvas();


//		var canvas = document.getElementById('mycanvas');
//		var context = canvas.getContext('2d');
//
//		// setup
////		canvas.width = 600;
////		canvas.height = 400;
//		
//		// Make it visually fill the positioned parent
//		  canvas.style.width ='100%';
//		  canvas.style.height='100%';
//		  // ...then set the internal size to match
//		  canvas.width  = canvas.offsetWidth;
//		  canvas.height = canvas.offsetHeight;
//		context.globalAlpha = 1.0;
//		context.beginPath();
//		context.moveTo(50, 50);
//		//   context.lineTo(100, 100);
//		context.quadraticCurveTo(100, 30, 100, 100);
//
//		context.strokeStyle = "black";
//		context.stroke();
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
			
		$scope.message="";

		var result = $http({
			method : 'POST',
			url : 'generateCode',
			data : JSON.stringify($scope.user),			
		});
		result.success(function(data,status) {
			if(!data.result)
		    {
		    	$location.path('/dashboard');
		    	$scope.mainService.currentUser=data;
		    	$scope.mainService.isUserLoggedIn=true;
		    	$sessionService.setObject("user",data);
		    }
		    else
		    {
		    	if (data.errorMsg == "Authentication Failed"){
		    		$scope.message="Wrong username or password, please try again !";	
		    	} else if(data.errorMsg == "User not found") {
		    		$scope.message="User Not Found!";	
		    	}
		    	
		    }
		  });
		result.error(function (data, status){
			console.log('Error Occured with status :'+status);
		});
	};

	
	
	$scope.logout = function(){
		$location.path('/');
		$sessionService.remove("user")
		$scope.mainService.currentUser=null;
		$scope.mainService.isUserLoggedIn=false;
	};
	
	
	/***********************************************************************************
						Dashboard Controller
	************************************************************************************/

	$scope.showOpenRequests = function (){
		
		MainService.showOpenRequests().then(
            function (result) {                
                $scope.mainService.userRequests = result;
                $location.path('/openrequests');
            },
            function (error) {
                console.log(error.statusText);
            }
        );
	}
	
	
	//MODAL WINDOW
	$scope.showCurrentRequestOnModalForVendor = function(req) {
		
	  $scope.currentRequestToEdit = req;
	  $scope.currentRequestToEditIndex = $scope.mainService.userRequests.indexOf(req);
	  $scope.changeStatusTo = req.status;
	  $scope.changeVendorRemarksTo = req.vendorRemarks;
      $scope.uibModalInstance = $uibModal.open({
        templateUrl: 'resources/templates/requestModal.html',
        controller: 'ModalCtrl',
        scope: $scope
      })
    };

    $scope.showCurrentRequestOnModalForHostelSysad = function(req) {
		
	  $scope.currentRequestToEdit = req;
	  $scope.currentRequestToEditIndex = $scope.mainService.userRequests.indexOf(req);
	  $scope.changeStatusTo = req.status;
	  $scope.changeHostelSysadRemarksTo = req.hostelSysadRemarks;
	  $scope.changeVendorRemarksTo = req.vendorRemarks;
      $scope.uibModalInstance = $uibModal.open({
        templateUrl: 'resources/templates/requestModalSysad.html',
        controller: 'ModalCtrl',
        scope: $scope
      })
    };
	
});

codeGeneratorApp.controller("ModalCtrl", function($scope,  $http, $uibModalInstance) {

	$scope.cancel = function() {
	    $uibModalInstance.dismiss();
	};
	 
	$scope.save = function() {
		$scope.mainService.userRequests[$scope.currentRequestToEditIndex].status = $scope.changeStatusTo;
		$scope.mainService.userRequests[$scope.currentRequestToEditIndex].vendorRemarks = $scope.changeVendorRemarksTo;
		$scope.mainService.userRequests[$scope.currentRequestToEditIndex].isChanged = true;
	    alert('Saved Req Id:'+ $scope.mainService.userRequests[$scope.currentRequestToEditIndex].id);
	    $uibModalInstance.close();
	};
	
	$scope.changeStatus = function(st) {
		$scope.changeStatusTo = st;		
	 }; 

	$scope.approveRequest = function () {
		$scope.mainService.userRequests[$scope.currentRequestToEditIndex].status = 'OPEN';
		$scope.mainService.userRequests[$scope.currentRequestToEditIndex].hostelSysadRemarks = $scope.changeHostelSysadRemarksTo;
		$scope.mainService.userRequests[$scope.currentRequestToEditIndex].isChanged = true;
	    alert('Approved Req Id :'+ $scope.mainService.userRequests[$scope.currentRequestToEditIndex].id);
	    $uibModalInstance.close();
	}

	$scope.rejectRequest = function () {
		$scope.mainService.userRequests[$scope.currentRequestToEditIndex].status = 'REJECT';
		$scope.mainService.userRequests[$scope.currentRequestToEditIndex].hostelSysadRemarks = $scope.changeHostelSysadRemarksTo;
		$scope.mainService.userRequests[$scope.currentRequestToEditIndex].isChanged = true;
	    alert('Rejected Req Id'+ $scope.mainService.userRequests[$scope.currentRequestToEditIndex].id);
	    $uibModalInstance.close();
	};

	$scope.addHostelSysad = function () {
		
		$scope.newSysadUser.userType="hostelsysad";	

		var result = $http({
			method : 'POST',
			url : 'addHostelSysad',
			data : angular.toJson($scope.newSysadUser),
		});
		result.success(function(data,status) {
			if(data.result=="Success")
		    {
		    	//$location.path('/dashboard');
		    	alert('Hostel Sysad Added Successfuly !');
		    	$uibModalInstance.close();
		    }
		    else
		    {
		    	console.log('Internal server error occured while adding hostel sysad with status :'+status);
		    	
		    }
		  });
		result.error(function (data, status){
			console.log('Error Occured in AJAX call with status :'+status);
		});	
	};
	
});