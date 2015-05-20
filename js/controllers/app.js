'use strict';

angular.module('App')
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $location, $ionicPopup, gettext, $locale) {
  // Form data for the login modal
    var dataLocalWeb = {
        "name": nameApp,
        "description": descriptionApp
    };
  
    var dataMenuCat = localStorage.getItem('dataLocalMenuCat');
    var dataLocalMenuCat = JSON.parse(dataMenuCat);
    
    var dataMenuPages = localStorage.getItem('dataLocalMenuPages');
    var dataLocalMenuPages = JSON.parse(dataMenuPages);
    
    $scope.general = dataLocalWeb;
    
    if (dataLocalMenuCat && _.size(dataLocalMenuCat) > 0) {
        $scope.categories = dataLocalMenuCat;
    } else {
        $scope.categories = false;
    }
    
    $http.get(wordpressUrl + '/wp-json/taxonomies/category/terms').success(function (data) {
      
        var dataRequerid = {};
        data.forEach(function(category, count) {
            dataRequerid[count] = { "ID": category.ID,
                "name": category.name,
                "count": category.count
            };
        });

        localStorage.setItem('dataLocalMenuCat', JSON.stringify(dataRequerid));
        $scope.categories = dataRequerid;
      
    }).error(function(data, status) {
        if (dataLocalMenuCat && _.size(dataLocalMenuCat) > 0) {
            $scope.categories = dataLocalMenuCat;
        } else {
            $scope.categories = {};
        }
    });
    
    if (dataLocalMenuPages && _.size(dataLocalMenuPages) > 0) {
        $scope.pages = dataLocalMenuPages;
    } else {
        $scope.pages = false;
    }
  
    $http.get(wordpressUrl + '/wp-json/pages?filter[orderby]=order&filter[order]=ASC').success(function (data) {
        var dataRequerid = {};
    

        data.forEach(function(page, count) {
            dataRequerid[count] = { "ID": page.ID,
                "title": page.title
            };
        });
        localStorage.setItem('dataLocalMenuPages', JSON.stringify(dataRequerid));
        $scope.pages = dataRequerid;
  
    }).error(function(data, status) {
        if (dataLocalMenuPages && _.size(dataLocalMenuPages) > 0) {
            $scope.pages = dataLocalMenuPages;
        } else {
            $scope.pages = false;
        }
    });
  
    $scope.getClassActive = function(path,$idCategory) {
        if ($location.path().substr(0, path.length) == path) {
            return "active";
        } else {
            return "item-category" + $idCategory;
        }
    }
    
    $scope.hiddenMenu = function() {
        var path = $location.path();
        
        if (path.search("/app/post") >= 0) {
            return 'hiddenMenu';
        }
      
        return false;
    }
  
    $scope.reloadCategories = function() {
  
        $http.get(wordpressUrl + '/wp-json/taxonomies/category/terms').success(function (data) {
          
            var dataRequerid = {};
      
            data.forEach(function(category, count) {
                dataRequerid[count] = { "ID": category.ID,
                    "name": category.name,
                    "count": category.count
                };
            });
      
            localStorage.setItem('dataLocalMenuCat', JSON.stringify(dataRequerid));
            $scope.categories = dataRequerid;
          
        });
      
    };
  
    $scope.reloadPages = function() {
  
        $http.get(wordpressUrl + '/wp-json/pages/33').success(function (data) {
    
            var dataRequerid = { "ID": data.ID,
                "title": data.title
            };
      
            localStorage.setItem('dataLocalMenuPage1', JSON.stringify(dataRequerid));
            $scope.page1 = dataRequerid;
          
        });
        
        $http.get(wordpressUrl + '/wp-json/pages/29').success(function (data) {
          
            var dataRequerid = { "ID": data.ID,
                "title": data.title
            };
      
            localStorage.setItem('dataLocalMenuPage2', JSON.stringify(dataRequerid));
            $scope.page2 = dataRequerid;
          
        });
      
    };
  
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/newsletter.html', {
        scope: $scope,
        animation: 'slide-in-up',
    }).then(function(modal) {
        $scope.formShow = true;
        $scope.modal = modal;
    });
  
    // Triggered in the login modal to close it
    $scope.closeNewsletter = function() {
        $scope.modal.hide();
    },
  
    // Open the login modal
    $scope.newsletter = function() {
        $scope.modal.show();
    };
    
    $scope.newsletterData = {};
  
    // Perform the login action when the user submits the login form
    $scope.doNewsletter = function() {
        $scope.formShow = false;
        
        $http.post(wordpressUrl + '/wp-newsletter.php', $scope.newsletterData).
        success(function(data) {
            if (data.status) {
                if (data.status == 0) {
                    $scope.formMessage = 'Erabiltzaileak ez dau emaila baieztatu.';
                    $scope.alert = 'energized';
                } else if (data.status == 1) {
                    $scope.formMessage = 'Erabiltzaileak emaila baieztatu dau. ';
                    $scope.alert = 'balanced';
                }
            } else {
                $scope.formMessage = 'Erabiltzailea izena eman dau.'
                $scope.alert = 'balanced';
            }
        }).
        error(function(data, status) {
            $scope.formMessage = 'Konexio errorea, saiatu beranduago. ';
            $scope.alert = 'assertive';
        }).finally(function() {
            $timeout(function() {
                $scope.closeNewsletter();
            }, 5000);
            
            $timeout(function() {
              $scope.formShow = true;
            }, 60000);
        });
    };
    
    
    
    //POPUP PARA SEARCH
    $scope.showPopupSearch = function() {
        $scope.data = {}
    
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.search" />',
            title: gettext('Search'),
            subTitle: gettext('Please use normal things'),
            scope: $scope,
            buttons: [
              { text: gettext('Close') },
              {
                text: '<b>'+ gettext('Search') + '</b>',
                type: 'button-positive',
                onTap: function(e) {
                  if (!$scope.data.search) {
                    e.preventDefault();
                  } else {
                    $location.path('/app/search/' + $scope.data.search);
      
                    return $scope.data.search;
                  }
                }
              }
            ]
        });
    };
});
