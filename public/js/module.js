'use strict';

var app = angular.module('authApp', ['ui.router', 'satellizer']);

app.run(function(Auth) {
  Auth.getProfile();
});

app.config(function($stateProvider, $urlRouterProvider, $authProvider) {
  $authProvider.github({
    clientId: '20dde4e1b29be8b7a4ce'
  });
  $authProvider.facebook({
    clientId: '240164176374531'
  });
  $authProvider.google({
    clientId: '414208493421-ir6kc6jqgrtq8pkd3v44l269e52ecpba.apps.googleusercontent.com'
  });
  $authProvider.twitter({
    clientId: 'pOfvDOnzFLwTzYBF6DUqUHG8d'
  });
  $authProvider.linkedin({
    clientId: '93r29maplxr58u'
  });

  $stateProvider
    .state('home', { url: '/', templateUrl: '/html/home.html', controller: 'homeCtrl' })
    .state('register', {
      url: '/register',
      templateUrl: '/html/authForm.html',
      controller: 'authFormCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: '/html/authForm.html',
      controller: 'authFormCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: '/html/profile.html',
      controller: 'profileCtrl',
      resolve: {
        profile: function(Auth, $q, $state) {
          return Auth.getProfile()
          .catch(() => {
            $state.go('home');
            return $q.reject();
          });
        }
      }
    })

  $urlRouterProvider.otherwise('/');
});

app.filter('titlecase', function() {
  return function(input) {
    return input[0].toUpperCase() + input.slice(1).toLowerCase();
  };
});
