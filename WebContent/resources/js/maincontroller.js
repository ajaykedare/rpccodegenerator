
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