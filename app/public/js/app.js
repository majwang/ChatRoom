var app =  angular.module('myApp',['firebase']);

app.controller("myController", function($scope, $firebaseArray) {
	var ref = firebase.database().ref().child("messages");
	  // create a synchronized array
	  $scope.messages = $firebaseArray(ref);
	  // add new items to the array
	  // the message is automatically added to our Firebase database!
	  $scope.addMessage = function() {
		$scope.messages.$add({
		  text: $scope.newMessageText
		});
	  };

  }
);

app.controller("SampleCtrl", ["$scope", "$firebaseAuth",
  function($scope, $firebaseAuth) {
    var auth = $firebaseAuth();
	var provider = new firebase.auth.GoogleAuthProvider();
	$scope.signIn = function() {
		firebase.auth().signInWithPopup(provider).then(function(result) {
		  // This gives you a Google Access Token. You can use it to access the Google API.
		  var token = result.credential.accessToken;
		  // The signed-in user info.
		  var user = result.user;
		  // ...
		}).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // The email of the user's account used.
		  var email = error.email;
		  // The firebase.auth.AuthCredential type that was used.
		  var credential = error.credential;
		  // ...
		});
	}
	$scope.signOut = function(){
		firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		}, function(error) {
		  // An error happened.
		});
	}
  }
]);
