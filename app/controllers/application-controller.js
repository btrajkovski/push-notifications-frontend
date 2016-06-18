(function () {
  'use strict';
  angular.module('push-notifications-frontend').controller('ApplicationController',
    ['ApplicationService', '$scope', '$mdDialog', 'toastr', '$mdMedia', 'UserService', '$rootScope',
      function (ApplicationService, $scope, $mdDialog, toastr, $mdMedia, UserService, $rootScope) {

        $scope.applications = [];
        $scope.removeId = 0;
        $scope.application = {};
        $scope.users = [];
        $scope.selectedUsers = [];
        $scope.editApplication = false;

        $scope.table = {
          order: 'name',
          limit: 10,
          page: 1,
          limitOptions: [5, 10, 15, {
            label: 'All',
            value: function () {
              return $scope.applications.length;
            }
          }]
        };

        var updateApplicationList = function () {
          ApplicationService.getApplications().then(
            function (response) {
              $scope.applications = response.data;
            },
            function (error) {
              console.log(error);
              toastr.error('error occurred ' + error);
            }
          );
        };

        var getAllUsers = function () {
          return UserService.getUsers().then(function (response) {
            $scope.users = response.data;
            console.log($scope.users);
          }, function (error) {
            console.log(error.data);
          });
        };

        updateApplicationList();
        getAllUsers();

        $scope.addPrompt = function (ev) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
          $mdDialog.show({
            scope: $scope,
            preserveScope: true,
            templateUrl: 'views/modals/new-application.html',
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
          });
        };

        function closeDialog() {
          $scope.editApplication = false;
          $scope.application = {};
          $scope.selectedUsers = [];
        }

        $scope.hide = function () {
          $scope.editApplication = false;
          $mdDialog.cancel();
        };

        $scope.save = function () {
          $scope.application.users = $scope.selectedUsers;
          if ($scope.editApplication) {
            $scope.editApplication = false;
            $scope.edit();
            return;
          }
          $scope.editApplication = false;
          ApplicationService.newApplication($scope.application).then(function (data) {
            // callback function (after -save)
            toastr.success('Application successfully saved');
            updateApplicationList();

          }, function (data) {
            // error callback function
            toastr.error('Error while saving application');
          });

          $scope.application = {};
          $scope.selectedUsers = [];
          // close modal and reset input object
          $scope.hide();
        };

        $scope.querySearch = function (query) {
          var results = query ? $scope.users.filter(createFilterFor(query)) : [];
          return results;
        };

        var createFilterFor = function (query) {
          var lowercaseQuery = angular.lowercase(query);

          return function filterFn(contact) {
            return (contact.fullName.toLowerCase().indexOf(lowercaseQuery) !== -1 && contact.id !== $rootScope.user.id);
          };
        };

        $scope.delete = function (application, event) {
          var confirm = $mdDialog.confirm()
            .title('Delete application')
            .textContent('Are you sure that you want to delete ' + application.name + ' ?')
            .ariaLabel('Delete application')
            .targetEvent(event)
            .ok('Confirm')
            .clickOutsideToClose(true)
            .cancel('Cancel');

          $mdDialog.show(confirm).then(function () {
            ApplicationService.removeApplication(application.id).then(function () {
              toastr.success('Application was successfully removed');
              updateApplicationList();
            }, function () {
              toastr.success('Error while removing application');
            });
          }, function () {
          });
        };

        $scope.editDialog = function (application, event) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
          $scope.editApplication = true;
          $scope.application = application;
          $scope.selectedUsers = application.users;
          $mdDialog.show({
            scope: $scope,
            preserveScope: true,
            templateUrl: 'views/modals/new-application.html',
            onRemoving: closeDialog,
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
          });
        };

        $scope.edit = function () {
          $scope.editApplication = true;
          $scope.application.users = $scope.selectedUsers;
          ApplicationService.editApplication($scope.application).then(function (data) {
            // callback function (after -save)
            toastr.success('Application successfully saved');
            updateApplicationList();

          }, function (data) {
            // error callback function
            toastr.error('Error while saving application');
          });

          $scope.application = {};
          $scope.selectedUsers = [];
          // close modal and reset input object
          $scope.hide();
        };

      }]);
})();
