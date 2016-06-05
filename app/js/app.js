var app =  angular.module('myapp',["firebase"]);
app.controller('myController', function($scope,$firebase){
		
		$scope.name = "Coder01";

		  // Get a reference to the database service
		  var ref = firebase.database();
		  
		 $scope.messages = $firebase(ref);

		  $scope.addMessage = function(e) {
				  if (e.keyCode != 13) return;
				  $scope.messages.$add({from: $scope.name, body: $scope.msg});
				  $scope.msg = "";
		  }
});


