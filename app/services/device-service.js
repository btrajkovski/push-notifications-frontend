(function () {
  'use strict';

  angular.module('push-notifications-frontend').service('DeviceService', DeviceService);

  function DeviceService($http) {
    var service = {};

    service.getDevices = getDevices;
    service.editDevice = editDevice;

    return service;

    function getDevices() {
      return $http.get('/api/devices');
    }

    function editDevice(device) {
      return $http.put('/api/devices', device);
    }
  }

})();
