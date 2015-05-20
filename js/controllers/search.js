'use strict';

angular.module('App')
.controller('searchCtrl', function($scope, $http, $stateParams, $ionicPopup, $location, $timeout, gettext) {
    
    $scope.categoryTitle = gettext('Search');
    
    $scope.searchSite = $stateParams.searchText;
    
    $http.get(wordpressUrl + '/wp-json/posts?filter[posts_per_page]=10&filter[s]=' + $stateParams.searchText).success(function (data) {
        if (data.length > 0) {
            $scope.posts = data;
        } else {
            $scope.posts = false;
        }
    }).error(function(data, status) {
      
        //Alerta
        $scope.showAlert = $ionicPopup.alert({
            title: gettext('Error'),
            template: gettext('Disconnected'),
            buttons: [{ text: gettext('OK'), 
                        type: 'button-stable'
                      }]
        });
        
        $timeout(function() {
            $scope.showAlert.close(); //close the popup after 3 seconds for some reason
        }, 3000);
      
    });
    
});
