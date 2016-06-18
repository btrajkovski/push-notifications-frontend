(function () {
  'use strict';
  angular.module('push-notifications-frontend').controller('NotificationController',
    ['NotificationService', 'ApplicationService', '$scope', '$mdDialog', 'toastr', '$mdMedia',
      function (NotificationService, ApplicationService, $scope, $mdDialog, toastr, $mdMedia) {

        $scope.notifications = [];
        $scope.applications = [];
        $scope.notification = {};
        $scope.removeId = 0;
        $scope.minDate = moment(new Date());
        $scope.pager = {};

        $scope.table = {
          order: 'title',
          limit: 10,
          page: 1,
          limitOptions: [5, 10, 15, {
            label: 'All',
            value: function () {
              return $scope.notifications.length;
            }
          }]
        };

        var updateNotifications = function () {
          NotificationService.getNotifications().then(
            function (response) {
              $scope.notifications = response.data;
            },
            function (error) {
              toastr.error('error occurred ' + error);
            }
          );

          ApplicationService.getApplications().then(
            function (response) {
              $scope.applications = response.data;
            },
            function (error) {
              console.log(error);
            }
          );
        };

        updateNotifications();

        $scope.save = function () {
          formatNotification();
          NotificationService.newNotification($scope.notification, $scope.notification.devices).then(
            function (response) {
              toastr.success('Notification was scheduled for sending');
              updateNotifications();
              addDialog.hide();
            },
            function (error) {
              toastr.error('Error while saving notification');
            }
          );

          $scope.hide();
          updateNotifications();
        };

        $scope.hide = function () {
          $mdDialog.cancel();
          $scope.notification = {};
        };

        $scope.addPrompt = function (ev) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
          $mdDialog.show({
            scope: $scope,
            preserveScope: true,
            templateUrl: 'views/modals/new-notification.html',
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
          });
        };

        var formatNotification = function () {
          $scope.notification.sendDate = moment($scope.notification.sendDate).format('DD/MM/YYYY HH:mm');
          $scope.notification.notificationType = $scope.notification.notificationType ? 'scheduled' : 'single';
        };

        $scope.delete = function (notification, event) {
          var confirm = $mdDialog.confirm()
            .title('Delete notification')
            .textContent('Are you sure that you want to delete ' + notification.title + ' ?')
            .ariaLabel('Delete notification')
            .targetEvent(event)
            .ok('Confirm')
            .clickOutsideToClose(true)
            .cancel('Cancel');

          $mdDialog.show(confirm).then(function () {
            NotificationService.removeNotification(notification.id).then(function () {
              toastr.success('Notification was succesfully deleted');
              updateNotifications();
            }, function () {
              toastr.success('Error while removing notification');
            })
          }, function () {
          });

          console.log('index ' + index);
        };

      }]);
})();

