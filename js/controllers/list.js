'use strict';

angular.module('App')
.controller('showCategoryCtrl', function($scope, $stateParams, $http, $ionicPopup, $location, $timeout, $window, gettext) {

    var urlCategory = wordpressUrl + '/wp-json/posts?filter[cat]=' + $stateParams.categoryId;
    var dataCategory = localStorage.getItem('dataLocalCategory-' + $stateParams.categoryId);
    var dataLocalCategory = JSON.parse(dataCategory);

    $scope.categoryTitle = $stateParams.categoryTitle;

    $scope.loading = true;
    $scope.numberPage = 2;

    if (dataLocalCategory && _.size(dataLocalCategory) > 0) {
        $scope.posts = dataLocalCategory;
    }

    $http.get(urlCategory + '&filter[posts_per_page]=10').success(function (data) {

        if (data && _.size(data) > 0) {

          if ((dataLocalCategory && dataLocalCategory['000'] && (data[0].ID != dataLocalCategory['000'].ID)) || !dataLocalCategory || !dataLocalCategory['000']) {

            var dataRequerid = {};

            data.forEach(function(post, count) {
                count = ('000' + count).substr(-3);

                dataRequerid[count] = { "ID": post.ID,
                    "title": post.title,
                    "terms": post.terms,
                    "featured_image": post.featured_image,
                    "date": post.date,
                    "link": post.link,
                    "excerpt": post.excerpt
                };
            });

            localStorage.setItem('dataLocalCategory-' + $stateParams.categoryId, JSON.stringify(dataRequerid));
            $scope.posts = dataRequerid;

          } else {
            $scope.posts = dataLocalCategory;
          }

        } else if (_.size(dataLocalCategory) > 0) {
          $scope.posts = dataLocalCategory;
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

    // REFRESH POST
    $scope.doRefresh = function() {
        $http.get(urlCategory  + '&filter[posts_per_page]=10').success(function(newItems) {
             if (newItems.length > 0) {
               $scope.posts = newItems;
             } else {
               $scope.posts = false;
             }
         }).finally(function() {
             // Stop the ion-refresher from spinning
             $scope.$broadcast('scroll.refreshComplete');
         });
    };


    // LOADING MORE POST
    $scope.loadingIcon = 'icon ion-ios-arrow-down';
    $scope.loadingMore = function() {

      $scope.loadingIcon = 'ion-load-c disabled';

      var dataCategoryLoading = localStorage.getItem('dataLocalCategory-' + $stateParams.categoryId + '-' + $scope.numberPage);
      var dataLocalCategoryLoading = JSON.parse(dataCategoryLoading);

      $http.get(urlCategory  + '&filter[posts_per_page]=' + (10 * $scope.numberPage)).success(function(data) {

          if (data.length > 0) {

              var dataRequerid = {};

              data.forEach(function(post, count) {

                  count = ('000' + count).substr(-3);

                  dataRequerid[count] = { "ID": post.ID,
                      "title": post.title,
                      "terms": post.terms,
                      "featured_image": post.featured_image,
                      "link": post.link,
                      "date": post.date,
                      "excerpt": post.excerpt
                  };
              });

              if (!dataLocalCategoryLoading || ((data.length == 20) && dataLocalCategoryLoading['000'] && (data[0].ID != dataLocalCategoryLoading['000'].ID)) || !dataLocalCategoryLoading['000']) {
                  localStorage.setItem('dataLocalCategory-' + $stateParams.categoryId + '-' + $scope.numberPage, JSON.stringify(dataRequerid));
              }

              $scope.posts = dataRequerid;

          } else if (Object.keys(dataLocalCategoryLoading).length > 0) {
              $scope.posts = dataLocalCategory;
          } else {
              $scope.posts = false;
          }
      }).error(function(data, status) {

        if (dataLocalCategoryLoading && Object.keys(dataLocalCategoryLoading).length > 0) {
            $scope.posts = dataLocalCategoryLoading;
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
          $scope.numberPage = $scope.numberPage + 1;
          $scope.loadingIcon = 'ion-ios-arrow-down';
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
      });
    }

    $scope.socialShare = function(social,post) {
        if (social == 'facebook') {
            $window.open('http://www.facebook.com/sharer.php?s=100&p[url]='+ post.link + '&p[title]=' + post.title, '_system', 'location=yes');
        } else if (social == 'twitter') {
            $window.open('http://twitter.com/share?url=' + encodeURIComponent(post.link) + '&text=' + encodeURIComponent(post.title), '_system', 'location=yes');
        } else if (social == 'google') {
            $window.open('https://plus.google.com/share?url=' + post.link, '_system', 'location=yes');
        } else if (social == 'pinterest') {
            $window.open('http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(post.link) + '&media=' + encodeURIComponent(post.featured_image.guid), '_system', 'location=yes');
        }

        return false;
    };
})

.controller('searchCtrl', function($scope, $http, $stateParams, $ionicPopup, $location, $timeout,gettext) {

    $scope.categoryTitle = gettext('Search');

    $scope.searchSite = $stateParams.searchText;

    $http.get(myUrl + '/wp-json/posts?filter[posts_per_page]=10&filter[s]=' + $stateParams.searchText).success(function (data) {
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
