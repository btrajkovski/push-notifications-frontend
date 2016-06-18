(function () {
  'use strict';

  angular.module('push-notifications-frontend').service('LoginService', LoginService);

  function LoginService($http, $rootScope, $q) {
    var service = {};

    service.getUser = getUser;
    service.logout = logout;
    service.authenticate = authenticate;


    return service;

    function getUser() {
      return $http.get('/api/user');
    }

    function logout() {
      $rootScope.user = {};
      $rootScope.autheticated = false;
      return $http.get('/auth/logout');
    }

    function authenticate() {
      var deferred = $q.defer();

      getUser().then(function (data) {
        $rootScope.autheticated = true;
        $rootScope.user = data.data;
        deferred.resolve(data.data);
      }, function (data) {
        $rootScope.autheticated = false;
        console.log('status: ' + data.status);
        console.log('data: ' + data.data);
        $rootScope.user = {};
        deferred.reject(data.status);
      });

      return deferred.promise;
    }
  }

})();
