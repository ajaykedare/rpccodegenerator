
codeGeneratorApp.factory('ReqService',['$http','$rootScope','$q', function(http,rootScope,q){
	var newService = new MainService(http,rootScope,q);
	return newService;
}]);


codeGeneratorApp.controller("ReqCtrl", function($scope, $http, $location, $q, MainService) {
	$scope.mainService=MainService;
	
	$scope.request={}
	$scope.request.username=$scope.mainService.currentUser.username;	
	$scope.selectedDate={};
	
	$scope.chooseHostel = function (hostel) {		
		$scope.request.hostelNo=hostel;
		MainService.getSlotsForUser(hostel).then(
            function (result) {                
                $scope.mainService.userSlots = result;            
            },
            function (error) {
                console.log(error.statusText);
            }
        );
        $scope.selectedDate={};
	}

	$scope.selectDate = function (slot) {		
		$scope.selectedDate=slot;		
		$scope.request.slotDateTS=slot.date;		
		$scope.request.slotStart=null;
		$scope.request.slotEnd=null;
		
	}

	$scope.selectTime = function (time) {
		
		$scope.request.slotStart=time.start;
		$scope.request.slotEnd=time.end;		
	};

	$scope.createRequest = function () {
		
		$scope.request.status="NEW";

		var result = $http({
			method : 'POST',
			url : 'newRequest',
			data : JSON.stringify($scope.request),			
		});
		result.success(function(data,status) {
		    console.log(data);		    
		    if(data.result=="Success")
		    {
		    	alert('Request Registered Successfuly !');
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
		    else
		    	{
		    		console.log('Error in registering request !');
		    		$scope.message="Error in registering request !";
		    	}
		  });
		result.error(function (data, status){
			console.log('Error in registering request. Error Status : ', status);		    		
		});
	};
	
});
		
