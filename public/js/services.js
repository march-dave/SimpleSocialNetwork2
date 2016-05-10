'use strict';

var app = angular.module('mybookApp');

app.service('MybookService', function($http, $q) {

  this.register = function(user) {
     return $http.post(`/api/users/register/`, user);
  };
  this.login = user => {
   return $http.post('/api/users/login', user)
    .then(res => {
      return this.getProfile();
    });
  };
  this.logout = () => {
    return $http.delete('/api/users/logout')
    .then(res => {
        this.currentUser = null;
        return $q.resolve();
    });
  };
  this.getProfile = () => {
   return $http.get('/api/users/profile')
    .then(res => {
        this.currentUser = res.data;
        return $q.resolve(res.data);
    })
    .catch(res => {
        this.currentUser = null;
        return $q.reject(res.data);
    });
  };
});
