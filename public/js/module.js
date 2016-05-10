'use strict';

var app = angular.module('mybookApp', ['ui.router']);

app.run(function(MybookService) {
  MybookService.getProfile();
});

var resolveObj = {
  profile: function(MybookService, $q, $state) {
    return MybookService.getProfile()
    .catch(() => {
      $state.go('home');
      return $q.reject();
    });
  }
}

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/html/home.html',
      controller: 'homeCtrl'
    })
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
      resolve: resolveObj
    })
    $urlRouterProvider.otherwise('/');
});

app.filter('titlecase', function() {
  return function(input) {
    return input[0].toUpperCase() + input.slice(1).toLowerCase();
  };
});
