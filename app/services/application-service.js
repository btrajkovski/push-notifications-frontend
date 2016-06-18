(function () {
  'use strict';

  angular.module('push-notifications-frontend').service('ApplicationService', ApplicationService);

  function ApplicationService($http, Upload) {
    var service = {};

    service.getApplications = getApplications;
    service.newApplication = newApplication;
    service.removeApplication = removeApplication;
    service.editApplication = editApplication;

    return service;

    function getApplications() {
      return $http.get('/api/applications');
    }

    function removeApplication(id) {
      return $http.delete('/api/applications/' + id);
    }

    function newApplication(application) {
      var data = {};
      data.application = Upload.json(application);
      if (application.appleCertificate && !angular.isUndefined(application.appleCertificate) && application.appleCertificate.file !== null) {
        data.file = application.appleCertificate.file;
      }

      return Upload.upload({
        url: '/api/applications',
        method: 'POST',
        data: data
      });
    }

    function editApplication(application) {
      var data = {};
      data.application = Upload.json(application);
      if (application.appleCertificate && !angular.isUndefined(application.appleCertificate) && application.appleCertificate.file !== null) {
        data.file = application.appleCertificate.file;
      }

      return Upload.upload({
        url: '/api/applications/edit',
        method: 'POST',
        data: data
      });
    }
  }

})();
