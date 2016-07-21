var app =  angular.module('myApp',['firebase', 'ngRoute', 'ngCart', 'ui.router', "image-engine-angular" ]);
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
      //console.log(text);
    },
      value:text
    };
});
app.config(function($routeProvider, $stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/home.html');

	$stateProvider
        .state('index', {
            url: '/index',
            controller: 'indexCtrl',
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
        .state('index.post', {
            url: '/post',
            templateUrl: '/templates/post.html',
			controller: 'postCtrl'
        })
		.state('index.chat', {
            url: '/chat',
            templateUrl: '/templates/chat.html',
			controller: 'chatController'
        });
});
app.config(function (imgEngConfigProvider) {
       imgEngConfigProvider.setToken('cyao');
       imgEngConfigProvider.isLite(); // Add this line only for ImageEngine Lite
    });
app.controller("indexCtrl", ["$scope", "Auth", "$window", "$location", "$state",
	function($scope, Auth, $window, $location, $state) {	
		$scope.message = 'Home Page';
		$scope.auth = Auth;
		$scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
		if(firebaseUser){
			// console.log("UID: "+firebaseUser.uid);
			// firebaseUser.providerData.forEach(function (profile) {
		 //    	console.log("Sign-in provider: "+profile.providerId);
		 //    	console.log("  Provider-specific UID: "+profile.uid);
		 //    	console.log("  Provider Name: "+profile.displayName);
		 //    	console.log("  Provider Email: "+profile.email);
		 //    	console.log("  Provider Photo URL: "+profile.photoURL);
		 //  	});
			user = firebaseUser;
		}
	    
		});
	}
]);

app.controller("storeCtrl", ["$scope", "Auth", "$window", "$location", "ngCart", '$http', '$state',
	function($scope, Auth, $window, $location, ngCart, remove, $http, $state) {	
		$scope.message = 'Store Page';
		$scope.amount = 0;
		ngCart.setTaxRate(7.5);
		ngCart.setShipping(2.99);  
		$scope.auth = Auth;
		$scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
			if(firebaseUser){
			// firebaseUser.providerData.forEach(function (profile) {
		 //    	console.log("Sign-in provider: "+profile.providerId);
		 //    	console.log("  Provider-specific UID: "+profile.uid);
		 //    	console.log("  Provider Name: "+profile.displayName);
		 //    	console.log("  Provider Email: "+profile.email);
		 //    	console.log("  Provider Photo URL: "+profile.photoURL);
		 //  	});
			user = firebaseUser;
			}
		});
	}
]);
app.controller("accountCtrl", ["$scope", "Auth", "$window", "$state", "$stateParams", "myService", "$sce",
	function($scope, Auth, $window, $state, $stateParams, myService, $sce) {	
		$scope.id = myService.get();
		var a, b, c;
		firebase.database().ref('/users/' + $scope.id).on('value', function(snapshot) { 
  				updateInfo(snapshot.val());
		});
		function updateInfo(snapshot){
			console.log(snapshot.pic);
  			$scope.name = snapshot.username;
  			$scope.email = snapshot.email;
  			$scope.message = 'Account Page for: ' + snapshot.username;
  			$scope.pic = $sce.trustAsResourceUrl(snapshot.pic);
  			$scope.$apply();
		}
	}
]);
app.controller("postCtrl", ["$scope", "Auth", "$window", "$location", "$firebaseArray", "myService", "$state",
	function($scope, Auth, $window, $location, $firebaseArray, myService, $state) {	
		$scope.auth = Auth;
		$scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;

		if(firebaseUser){
			/*firebaseUser.providerData.forEach(function (profile) {
		    	console.log("Sign-in provider: "+profile.providerId);
		    	console.log("  Provider-specific UID: "+profile.uid);
		    	console.log("  Provider Name: "+profile.displayName);
		    	console.log("  Provider Email: "+profile.email);
		    	console.log("  Provider Photo URL: "+profile.photoURL);
		  	});
		  	*/
			user = firebaseUser;
			}
		});
		var threadId = myService.get();
		console.log(threadId);
		var ref = firebase.database().ref().child("Posts/" + threadId);
		$scope.messages = $firebaseArray(ref);
	    $scope.addMessage = function() {
			$scope.messages.$add({
			  user: user.displayName,
			  email: user.email,
			  id: user.uid,
			  text: $scope.newMessageText
			});
			$scope.newMessageText = "";
		};
		firebase.database().ref('/Thread/' +  threadId).on('value', function(snapshot) { 
  				updateInfo(snapshot.val());
		});
		function updateInfo(snapshot){
			$scope.message = snapshot.topic;
			$scope.author = snapshot.author;
			$scope.authorId = snapshot.authorId;

		}
		if($scope.authorId == $scope.firebaseUser.uid){
		    console.log("TRUE");
			$scope.isAuthor = true;
		}
		$scope.edit = function(){
			$scope.editing = true;
		}
			
	}
]);
app.controller("forumsCtrl", ["$scope", "Auth", "$window", "$location", "$firebaseArray", "myService", "$state",
	function($scope, Auth, $window, $location, $firebaseArray, myService, $state) {	
		$scope.message = 'Forums Page';
		$scope.topic = '';
		$scope.auth = Auth;
		$scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
		if(firebaseUser){
			/*firebaseUser.providerData.forEach(function (profile) {
		    	console.log("Sign-in provider: "+profile.providerId);
		    	console.log("  Provider-specific UID: "+profile.uid);
		    	console.log("  Provider Name: "+profile.displayName);
		    	console.log("  Provider Email: "+profile.email);
		    	console.log("  Provider Photo URL: "+profile.photoURL);
		  	});
		  	*/
			user = firebaseUser;
			}
		});
		var randomId = Math.round(Math.random() * 100000000);
		var ref = firebase.database().ref().child("Thread/");
		$scope.threads =  $firebaseArray(ref);
		$scope.addThread = function() {
			$scope.threads.$add({
			    author: user.displayName,
			    authorId: user.uid,
			    threadId: randomId,
			    topic: $scope.topic
			});
			$scope.topic = "";
		};
		$scope.goToThread = function(id){
			$scope.id = id;
			myService.set($scope.id);
			console.log("ThreadId: " + myService.get());
			$state.go('index.post');
		}
	}
]);
app.controller("chatController", ["$scope", "$firebaseArray", "Auth", "$window", "$state", "myService",
	function($scope, $firebaseArray, Auth, $window, $state, myService) {
		$scope.message = 'ChatRoom';
		$scope.auth = Auth;
		$scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
		if(firebaseUser){
			/*firebaseUser.providerData.forEach(function (profile) {
		    	console.log("Sign-in provider: "+profile.providerId);
		    	console.log("  Provider-specific UID: "+profile.uid);
		    	console.log("  Provider Name: "+profile.displayName);
		    	console.log("  Provider Email: "+profile.email);
		    	console.log("  Provider Photo URL: "+profile.photoURL);
		  	});
		  	*/
			user = firebaseUser;
			}
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
			  id: user.uid,
			  text: $scope.newMessageText
			});
			$scope.newMessageText = "";
		};
		$scope.goToAccount = function(id){
			$scope.id = id;
			myService.set($scope.id);
			console.log("id: " + myService.get());
			$state.go('index.account');
		}
    }
]);

app.controller("loginCtrl", ["$scope", "Auth", "$window", "$location", "$sce",
  function($scope, Auth, $window, $location, $sce) {
	$scope.message = 'My Account';
	
    $scope.auth = Auth;
	$scope.auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
		
		if(firebaseUser){
			firebaseUser.providerData.forEach(function (profile) {
		    	//console.log("Sign-in provider: "+profile.providerId);
		    	//console.log("  Provider-specific UID: "+profile.uid);
		    	//console.log("  Provider Name: "+profile.displayName);
		    	//console.log("  Provider Email: "+profile.email);
		    	//console.log("  Provider Photo URL: "+profile.photoURL);
		    	$scope.photoURL = $sce.trustAsResourceUrl(profile.photoURL);
				user = profile;
		  	});
			
			console.log(user.photoURL);
		    firebase.database().ref('users/' + firebaseUser.uid).set({
    			username: firebaseUser.displayName,
    			email: firebaseUser.email,
    			id: firebaseUser.uid,
    			pic: user.photoURL
  		  	});
		}
	    
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
		  var firebaseUser = result.user;

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
