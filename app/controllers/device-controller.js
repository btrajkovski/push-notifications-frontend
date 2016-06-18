(function () {
  'use strict';
  angular.module('push-notifications-frontend').controller('DeviceController',
    ['DeviceService', '$scope', 'toastr',
      function (DeviceService, $scope, toastr) {

        $scope.devices = [];

        $scope.table = {
          order: 'deviceID',
          limit: 10,
          page: 1,
          limitOptions: [5, 10, 15, {
            label: 'All',
            value: function () {
              return $scope.devices.length;
            }
          }]
        };

        var updateDevicesList = function () {
          DeviceService.getDevices().then(
            function (response) {
              $scope.devices = response.data;
            },
            function (error) {
              console.log(error);
              toastr.error('error occurred ' + error);
            }
          );
        };

        updateDevicesList();

        $scope.save = function (device) {
          DeviceService.editDevice(device).then(function (response) {
              updateDevicesList();
              toastr.success('Device status update');
            },
            function (error) {
              console.log(error);
              toastr.error('error occurred ' + error);
            });
        };

      }]);
})();

