/**
 * Secured states
 * All inherit from root (which has data : secured)
 */
(function () {
  'use strict';

  angular.module('push-notifications-frontend').config([
      '$stateProvider',
      '$urlRouterProvider',
      '$translateProvider',
      '$breadcrumbProvider',
      function ($stateProvider, $urlRouterProvider, $translateProvider, $breadcrumbProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('root', {
          url: '/',
          views: {
            navbar: {
              templateUrl: 'views/main/navbar.html',
              controller: 'NavbarController'
            },
            main: {
              templateUrl: 'views/main/main.html'
            },
            sidebar: {
              templateUrl: 'views/main/sidebar.html',
              controller: 'SidebarController'
            }
          },
          ncyBreadcrumb: {
            label: 'Home'
          }
        });

        $stateProvider.state('root.login', {
          url: 'login',
          views: {
            'navbar@': {
              // No navbar for login page
            },
            'main@': {
              templateUrl: 'views/main/login.html',
              controller: 'LoginController'
            },
            'sidebar@': {
              // No sidebar for login page
            }
          }
        });

        $stateProvider.state('root.notifications', {
          url: 'notifications',
          views: {
            'main@': {
              templateUrl: 'views/main/notifications.html',
              controller: 'NotificationController'
            }
          },
          ncyBreadcrumb: {
            label: 'Notifications'
          }
        });

        $stateProvider.state('root.applications', {
          url: 'applications',
          views: {
            'main@': {
              templateUrl: 'views/main/applications.html',
              controller: 'ApplicationController'
            }
          },
          ncyBreadcrumb: {
            label: 'Applications'
          }
        });

        $stateProvider.state('root.devices', {
          url: 'devices',
          views: {
            'main@': {
              templateUrl: 'views/main/devices.html',
              controller: 'DeviceController'
            }
          },
          ncyBreadcrumb: {
            label: 'Devices'
          }
        });

        $stateProvider.state('root.api', {
          url: 'api',
          views: {
            'main@': {
              templateUrl: 'views/main/api.html',
              controller: 'ApiController'
            }
          },
          ncyBreadcrumb: {
            label: 'Devices'
          }
        });

        $translateProvider.useSanitizeValueStrategy('escape');

        $breadcrumbProvider.setOptions({
          templateUrl: 'views/templates/breadcrumb.html'
        });
      }])

    .run([
      '$rootScope',
      'LoginService',
      '$state',
      function ($rootScope, LoginService, $state) {
        $rootScope.menuItems = [
          {
            state: 'root',
            icon: 'fa-home',
            name: 'Home'
          },
          {
            state: 'root.notifications',
            icon: 'fa-bell-o',
            name: 'Notifications'
          }, {
            state: 'root.applications',
            icon: 'fa-users',
            name: 'Applications'
          }, {
            state: 'root.devices',
            icon: 'fa-mobile',
            name: 'Devices'
          }];
        console.log('route change');



        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
          // Redirect to login page if not logged in
          // $rootScope.state = toState;
          console.log('AUTH' + $rootScope.autheticated);
          if (!$rootScope.autheticated && toState.name !== 'root.login') {
            LoginService.authenticate().then(function (data) {
              console.log('yee' + data);
              event.preventDefault();
              $state.go(toState);
            }, function (data) {
              console.log('nee' + data);
              event.preventDefault();
              $state.go('root.login');
            });
          }

          // Redirect to notifications if logged in
          if (($rootScope.autheticated) && toState.name === 'root.login') {
            event.preventDefault();
            $state.go('root.notifications');
          }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
          $rootScope.state = toState.name;
          // $state.current = toState;
          switch (toState.name) {
            case 'root.login':
              $rootScope.bodyClass = 'login-layout';
              break;
            default:
              $rootScope.bodyClass = 'other-layout';
              break;
          }
        });
      }]);
})();


