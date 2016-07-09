var app =  angular.module('myApp',['firebase', 'ngRoute', 'ngCart']);
var user;
app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);
app.config(function($routeProvider) {
	$routeProvider
		.when('/index', {
			templateUrl : 'index.html',
			controller  : 'indexCtrl'
		})
		// route for the home page
		.when('/chat', {
			templateUrl : 'chat.html',
			controller  : 'chatController'
		})

		// route for the about page
		.when('/login', {
			templateUrl : 'login.html',
			controller  : 'loginCtrl'
		})
		
		.when('/store', {
			templateUrl : 'store.html',
			controller  : 'storeCtrl'
		})
		
		.when('/account', {
			templateUrl : 'account.html',
			controller  : 'accountCtrl'
		})

		.when('/forums', {
			templateUrl : 'forums.html',
			controller  : 'forumsCtrl'
		})
});

app.controller("indexCtrl", ["$scope", "Auth", "$window", "$location",
	function($scope, Auth, $window, $location) {	
		$scope.message = 'Home Page';
	}
]);

app.controller("storeCtrl", ["$scope", "Auth", "$window", "$location", "ngCart",
	function($scope, Auth, $window, $location, ngCart) {	
		$scope.message = 'Store Page';
	}
]);
app.controller("accountCtrl", ["$scope", "Auth", "$window", "$location",
	function($scope, Auth, $window, $location) {	
		$scope.message = 'Account Page';
	}
]);
app.controller("forumsCtrl", ["$scope", "Auth", "$window", "$location",
	function($scope, Auth, $window, $location) {	
		$scope.message = 'Forums Page';
	}
]);
app.controller("chatController", ["$scope", "$firebaseArray", "Auth", 
	function($scope, $firebaseArray, Auth) {
		$scope.message = 'ChatRoom';
		$scope.auth = Auth;
		$scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
		console.log("Name: "+firebaseUser.displayName);
		firebaseUser.providerData.forEach(function (profile) {
		    console.log("Sign-in provider: "+profile.providerId);
		    console.log("  Provider-specific UID: "+profile.uid);
		    console.log("  Provider Name: "+profile.displayName);
		    console.log("  Provider Email: "+profile.email);
		    console.log("  Provider Photo URL: "+profile.photoURL);
		  });
	    user = firebaseUser;
		});
		
		var ref = firebase.database().ref().child("messages");
		// create a synchronized array
		$scope.messages = $firebaseArray(ref);
		// add new items to the array
		// the message is automatically added to our Firebase database!
		$scope.addMessage = function() {
			$scope.messages.$add({
			  user: user.displayName,
			  text: $scope.newMessageText
			});
		};

    }
]);

app.controller("loginCtrl", ["$scope", "Auth", "$window", "$location",
  function($scope, Auth, $window, $location) {
	$scope.message = 'Login Page';
    $scope.auth = Auth;
	$scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
		console.log("Name: "+firebaseUser.displayName);
		firebaseUser.providerData.forEach(function (profile) {
		    console.log("Sign-in provider: "+profile.providerId);
		    console.log("  Provider-specific UID: "+profile.uid);
		    console.log("  Provider Name: "+profile.displayName);
		    console.log("  Provider Email: "+profile.email);
		    console.log("  Provider Photo URL: "+profile.photoURL);
		  });
	    user = firebaseUser;
    });
	
	$scope.rename = function(){
		user.updateProfile({
		  displayName: $scope.name,
		}).then(function() {
		  // Update successful.
		   console.log("updated");
		   $window.location.reload();
		}, function(error) {
		  // An error happened.
		});
	}
	$scope.signInG = function() {
		var provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope('https://www.googleapis.com/auth/plus.login');
		firebase.auth().signInWithRedirect(provider);
		firebase.auth().getRedirectResult().then(function(result) {
		  if (result.credential) {
			// This gives you a Google Access Token. You can use it to access the Google API.
			var token = result.credential.accessToken;
			// ...
		  }
		  // The signed-in user info.
		  var user = result.user;
		}).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // The email of the user's account used.
		  var email = error.email;
		  // The firebase.auth.AuthCredential type that was used.
		  var credential = error.credential;
		  console.log(errorMessage);
		});
	}
	
	$scope.signOut = function(){
		firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		  $window.location.reload();
		}, function(error) {
		  // An error happened.
		  console.log(error.message);
		});
	}
  }
]);
