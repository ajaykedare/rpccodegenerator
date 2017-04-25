/********************************************************************************
 * 
 * 							MODAL Controller
 * 
 * ******************************************************************************/

codeGeneratorApp.controller("ModalCtrl", function($scope,  $http, $uibModalInstance, $sessionService) {

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
     };
      
     $scope.removeParameter = function(idx) {
    	  $scope.newMethod.parameters.splice(idx, 1);
     };
      
     $scope.addMember = function () {
  		$scope.newCustomStructureType.members.push({ 
            name: "",
            type: "",
            namePlaceholder: "Enter Member name",
            typePlaceholder: "Enter Member type"
          });  		
      };
        
      $scope.removeMember = function(idx) {
      	  $scope.newCustomStructureType.parameters.splice(idx, 1);
      };
      
      $scope.addMethod = function() {    	
  		$scope.data.methods.push($scope.newMethod);
  		$sessionService.setObject("data",$scope.data);
  		$scope.setLines(); 		
  		
  		$uibModalInstance.close();
  	};
  	
  	$scope.addCustomStructureType = function() {		
  		$scope.newCustomStructureType.type="struct";
  		$scope.data.data_structures.push($scope.newCustomStructureType);  		
  		$sessionService.setObject("data",$scope.data);
  		$scope.setLines();  		
  		$uibModalInstance.close();
	};
  	
  	$scope.deleteMethod = function() { 		
  		
  		for (var i = $scope.data.methods.length - 1; i >= 0; i--) {
  		    if ($scope.data.methods[i].methodname == $scope.methodToDelete.methodname) {
  		    	$scope.data.methods.splice(i, 1);
  		    }
  		}
  		
  		
  		for (var i = $scope.data.data_structures.length - 1; i >= 0; i--) {
  		    if ($scope.data.data_structures[i].name == $scope.customStructureTypeToDelete.name) {
  		    	$scope.data.data_structures.splice(i, 1);
  		    }
  		}
  		$scope.setLines();
  		$sessionService.setObject("data",$scope.data);  		
  		$uibModalInstance.close();  	
  	};	
});