'use strict';

angular.module('App')
.controller('showPageCtrl', function($scope, $stateParams, $http, gettext) {
  
    var dataPage = localStorage.getItem('dataLocalPage' + $stateParams.pageId);
    var dataLocalPage = JSON.parse(dataPage);
    
    $scope.loading = true;
    $scope.pageTitle = gettext('Loading...');
  
    $http.get(wordpressUrl + '/wp-json/pages/' + $stateParams.pageId).success(function (data) {
        var dataRequerid = { "ID": data.ID,
            "title": data.title,
            "content": data.content
        };

        localStorage.setItem('dataLocalPage' + $stateParams.pageId, JSON.stringify(dataRequerid));
        $scope.page = dataRequerid;
      
        $scope.pageTitle = dataRequerid.title;
      
    }).error(function(data, status) {
      
        if (dataLocalPage) {
            $scope.page = dataLocalPage;
            $scope.pageTitle = dataLocalPage.title;
        } else {
            $scope.page = false;
            $scope.pageTitle = gettext('No data');
        }
      
    }).finally(function() {
        $scope.loading = false;
    });
});