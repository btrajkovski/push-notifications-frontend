(function () {
  'use strict';

  angular.module('push-notifications-frontend').service('UserService', UserService);

  function UserService($http) {
    var service = {};

    service.getUsers = getUsers;

    return service;

    function getUsers() {
      return $http.get('/api/users');
    }

  }

})();
