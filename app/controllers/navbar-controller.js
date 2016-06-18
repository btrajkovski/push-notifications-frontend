(function () {
  'use strict';

  angular.module('push-notifications-frontend').controller('NavbarController',
    ['$scope', '$mdSidenav', 'LoginService', '$state', '$rootScope',
    function ($scope, $mdSidenav, LoginService, $state, $rootScope) {
      $scope.toggleSidemenu = function () {
        $mdSidenav('left').toggle();
      };

      $scope.logout = function (event) {
        $rootScope.user = {};
        $rootScope.autheticated = false;
        LoginService.logout().then(function (response) {
            console.log(response.data);
          },
          function (response) {
            console.log(response.data);
          });
        event.preventDefault();
        $state.go('root.login');
      };
    }]);


})();
