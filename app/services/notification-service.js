(function () {
  'use strict';

  angular.module('push-notifications-frontend').service('NotificationService', NotificationService);

  function NotificationService($http) {
    var service = {};

    service.getNotifications = getNotifications;
    service.newNotification = newNotification;
    service.removeNotification = removeNotification;

    return service;

    function getNotifications() {
      return $http.get('/api/notifications');
    }

    function newNotification(notification, platform) {
      return $http.post('/api/notifications/platform/' + platform, notification);
    }

    function removeNotification(id) {
      return $http.delete('/api/notifications/' + id);
    }
  }

})();
