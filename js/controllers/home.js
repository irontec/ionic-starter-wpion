'use strict';

angular.module('App')
.controller('HomeCtrl', function($scope, $http, $ionicPopup, $location, $timeout, gettext) {
  
    var urlPrincipal = wordpressUrl + '/wp-json/posts?filter[posts_per_page]=15';
    var dataHome = localStorage.getItem('dataLocalHome');
    var dataLocalHome = JSON.parse(dataHome);
    
    $scope.loading = true;
    
    if (dataLocalHome && Object.keys(dataLocalHome).length > 0) {
        $scope.posts = dataLocalHome;
        $scope.sliderHome = dataLocalHome;
    }
    $http.get(urlPrincipal).success(function (data) {
      
        if (data && (data.length > 0)) {
    
            if ((dataLocalHome && dataLocalHome['000'] && (data[0].ID != dataLocalHome['000'].ID)) || !dataLocalHome || !dataLocalHome['000']) {
                var dataRequerid = {};
                console.log(data);
                data.forEach(function(post, count) {
                  
                    count = ('000' + count).substr(-3);
                    
                    dataRequerid[count] = { "ID": post.ID,
                        "title": post.title,
                        "terms": post.terms,
                        "featured_image": post.featured_image,
                        "date": post.date
                    };
                });
                console.log("ERROR HOME");
        
                localStorage.setItem('dataLocalHome', JSON.stringify(dataRequerid));
                
                $scope.posts = dataRequerid;
                $scope.sliderHome = dataRequerid;
      
            } else {
                $scope.posts = dataLocalHome;
                $scope.sliderHome = dataLocalHome;
            }
    
        } else if (Object.keys(dataLocalHome).length > 0) {
            $scope.posts = dataLocalHome;
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
    }).finally(function() {
        $scope.loading = false;
    });
    
  
    // REFRESH LIST
    $scope.doRefresh = function() {
      $http.get(urlPrincipal)
       .success(function(newItems) {
         if (newItems.length > 0) {
  
           if ((dataLocalHome && dataLocalHome['000'] && (newItems[0].ID != dataLocalHome['000'].ID)) || !dataLocalHome || !dataLocalHome['000']) {
             var dataRequerid = {};
  
             data.forEach(function(post, count) {
               dataRequerid[count] = { "ID": post.ID,
                   "title": post.title,
                   "terms": post.terms,
                   "featured_image": post.featured_image,
                   "date": post.date
               };
             });
  
             localStorage.setItem('dataLocalHome', JSON.stringify(dataRequerid));
  
             $scope.posts = newItems;
             $scope.sliderHome = newItems;
           } else {
             $scope.posts = dataLocalHome;
             $scope.sliderHome = dataLocalHome;
           }
  
//           //Alerta
//           $scope.showAlert = $ionicPopup.alert({
//             title: gettext('Success'),
//             template: gettext('Refresh'),
//             buttons: [{ text: gettext('OK'),
//                         type: 'button-balanced'
//                       }]
//           });
//  
//           $timeout(function() {
//             $scope.showAlert.close(); //close the popup after 3 seconds for some reason
//           }, 1000);
  
         } else {
           $scope.posts = false;
         }
       }).error(function(data, status) {
  
         if (dataLocalHome && Object.keys(dataLocalHome).length > 0) {
           $scope.posts = dataLocalHome;
           $scope.sliderHome = dataLocalHome;
         }
  
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
  
       }).finally(function() {
         // Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
       });
    };
}).filter('toArray', function() { return function(obj) {
  if (!(obj instanceof Object)) return obj;
  return _.map(obj, function(val, key) {
      return Object.defineProperty(val, '$key', {__proto__: null, value: key});
  });
}});
