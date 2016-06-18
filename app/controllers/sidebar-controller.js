(function () {
  'use strict';

  angular.module('push-notifications-frontend').controller('SidebarController', ['$mdSidenav', '$scope', '$state',
    function ($mdSidenav, $scope, $state) {
      $scope.toggleSidemenu = function () {
        $mdSidenav('left').toggle();
      };
    }]);
  
})();
