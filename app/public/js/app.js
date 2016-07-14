var app =  angular.module('myApp',['firebase', 'ngRoute', 'ngCart', 'ui.router' ]);
var user;
app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

app.service('myService', function(){
   var text ='hello';
   return { 
     get: function(){
       return text;
    },
     set: function(value){
      text=value;
      console.log(text);
    },
      value:text
    };
});
app.config(function($routeProvider, $stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/home.html');

	$stateProvider
        .state('index', {
            url: '/index',
			views: {
				"index": {
					templateUrl: '/templates/home.html',
					controller: 'indexCtrl'
				},
			  }			
        })
        .state('index.account', {
            url: '/account',
            templateUrl: '/templates/account.html',
			controller: 'accountCtrl'
        })
		.state('index.login', {
            url: '/login',
            templateUrl: '/templates/login.html',
			controller: 'loginCtrl'
        })
		.state('index.store', {
            url: '/store',
            templateUrl: '/templates/store.html',
			controller: 'storeCtrl'
        })
		.state('index.forums', {
            url: '/forums',
            templateUrl: '/templates/forums.html',
			controller: 'forumsCtrl'
        })
		.state('index.chat', {
            url: '/chat',
            templateUrl: '/templates/chat.html',
			controller: 'chatController'
        });
});

app.controller("indexCtrl", ["$scope", "Auth", "$window", "$location", "$state",
	function($scope, Auth, $window, $location, $state) {	
		$scope.message = 'Home Page';
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
	}
]);

app.controller("storeCtrl", ["$scope", "Auth", "$window", "$location", "ngCart", '$http', '$state',
	function($scope, Auth, $window, $location, ngCart, $http, $state) {	
		$scope.message = 'Store Page';
		$scope.amount = 0;
		ngCart.setTaxRate(7.5);
		ngCart.setShipping(2.99);  
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
	}
]);
app.controller("accountCtrl", ["$scope", "Auth", "$window", "$state", "$stateParams", "myService",
	function($scope, Auth, $window, $state, $stateParams, myService) {	
		$scope.email = myService.get();
		$scope.message = 'Account Page for: ' + $scope.email;
	}
]);
app.controller("forumsCtrl", ["$scope", "Auth", "$window", "$location",
	function($scope, Auth, $window, $location) {	
		$scope.message = 'Forums Page';
	}
]);
app.controller("chatController", ["$scope", "$firebaseArray", "Auth", "$window", "$state", "myService",
	function($scope, $firebaseArray, Auth, $window, $state, myService) {
		$scope.message = 'ChatRoom';
		$scope.auth = Auth;
		$scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
		console.log("Name: "+firebaseUser.displayName + "," + firebaseUser.email);
		firebaseUser.providerData.forEach(function (profile) {
		    console.log("Sign-in provider: "+profile.providerId);
		    console.log("  Provider-specific UID: "+profile.uid);
		    console.log("  Provider Name: "+profile.displayName);
		    console.log("  Provider Email: "+profile.email);
		    console.log("  Provider Photo URL: "+profile.photoURL);
			user = profile;
		  });
	    
		});
		
		var ref = firebase.database().ref().child("messages");
		// create a synchronized array
		$scope.messages = $firebaseArray(ref);
		// add new items to the array
		// the message is automatically added to our Firebase database!
		$scope.addMessage = function() {
			$scope.messages.$add({
			  user: user.displayName,
			  email: user.email,
			  text: $scope.newMessageText
			});
		};
		$scope.goToAccount = function(email){
			$scope.email = email;
			myService.set($scope.email);
			console.log("email: " + myService.get());
			$state.go('index.account');
		}
    }
]);

app.controller("loginCtrl", ["$scope", "Auth", "$window", "$location",
  function($scope, Auth, $window, $location) {
	$scope.message = 'My Account';
	
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
