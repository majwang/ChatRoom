var app =  angular.module('myApp',['firebase']);
app.controller('myController', function($scope, $firebase){
		
		$scope.names = "Coder01";
		
		var ref = firebase.database();
		$scope.messages = $firebase(ref);
  
		  $scope.addMessage = function(e) {
				  if (e.keyCode != 13) return;
				  $scope.messages.$add({from: $scope.name, body: $scope.msg});
				  $scope.msg = "";
		   }
})


