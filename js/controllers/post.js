'use strict';

angular.module('App')
.controller('showPostCtrl', function($scope, $http, $stateParams, $ionicPopup, $timeout, $window, gettext) {
  
    var dataPosts = localStorage.getItem('dataPosts');
    var dataLocalPosts = JSON.parse(dataPosts);
  
//  delete dataLocalPosts[Object.keys(dataLocalPosts).pop()];
  
    $scope.loading = true;
    $scope.postTitle = 'Kargatzen...';
    
    if (dataLocalPosts && Object.keys(dataLocalPosts).length > 0) {
        dataLocalPosts.forEach(function (value, i) {
            if (value.ID == $stateParams.postId) {
                $scope.post = value;
                $scope.postTitle = value.title;
                return true;
            }
        });
        
        if (!$scope.post) {
            $scope.postTitle = gettext('No data');
        }
    }
    
    $http.get(wordpressUrl + '/wp-json/posts/' + $stateParams.postId).success(function (data) {
      
        var posts = [];
        
        var urlCategory = wordpressUrl + '/wp-json/posts?filter[cat]=' + (data.terms.category[0].ID);
        var dataRequerid = {};
        
        $http.get(urlCategory + '&filter[posts_per_page]=6').success(function (dataPosts) {
          
            if (dataPosts && dataPosts.length > 0) {
                    
                dataPosts.forEach(function(post, count) {
                    dataRequerid[count] = { "ID": post.ID, 
                        "title": post.title,
                        "featured_image": post.featured_image,
                        "date": post.date,
                        "link": post.link,
                        "excerpt": post.excerpt
                    };
                });
            }
        });
        
        var post = {"ID": data.ID, 
            "title": data.title,
            "date": data.date,
            "featured_image": data.featured_image,
            "link": data.link,
            "content": data.content,
            "terms": data.terms,
            "posts": dataRequerid,
            "more_posts": Object.keys(dataRequerid).length,
        };
        
        if (!dataLocalPosts) {
          
            posts.push(post);
            
            localStorage.setItem('dataPosts', JSON.stringify(posts));
          
        } else if (dataLocalPosts && Object.keys(dataLocalPosts).length < 35) {
    
            var exists = false;
            
            dataLocalPosts.forEach(function (value, i) {
                if (value.ID == data.ID) {
                    exists = true;
                    
                    return true;
                }
            });
            
            if (!exists) {
                dataLocalPosts.push(post);
                localStorage.setItem('dataPosts', JSON.stringify(dataLocalPosts));
            }
        } else {
          
            var exists = false;
            
            dataLocalPosts.forEach(function (value, i) {
                if (value.ID == data.ID) {
                    exists = true;
                    return true;
                }
            });
            
            if (!exists) {
                delete dataLocalPosts[0];
                
                dataLocalPosts.forEach(function (value, i) {
                    posts.push(value);
                });
                
                posts.push(post);
                
                localStorage.setItem('dataPosts', JSON.stringify(posts));
            }
        }
        
        $scope.post = post;
        
        $scope.postTitle = post.title;
      
    }).error(function(data, status) {
      
        if (dataLocalPosts && Object.keys(dataLocalPosts).length > 0) {
            dataLocalPosts.forEach(function (value, i) {
                if (value.ID == $stateParams.postId) {
                    $scope.post = value;
                    $scope.postTitle = value.title;
                    return true;
                }
            });
            
            if (!$scope.post) {
                $scope.postTitle = gettext('No data');
            }
        } else {
            $scope.post = false;
            $scope.postTitle = gettext('No data');
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
        $scope.loading = false;
    });
    
    $scope.socialShare = function(social,post) {
        if (social == 'facebook') {
            $window.open('http://www.facebook.com/sharer.php?s=100&p[url]='+ post.link + '&p[title]=' + post.title, '_system', 'location=yes');
        } else if (social == 'twitter') {
            $window.open('http://twitter.com/share?url=' + encodeURIComponent(post.link) + '&text=' + encodeURIComponent(post.title), '_system', 'location=yes');
        } else if (social == 'google') {
            $window.open('https://plus.google.com/share?url=' + post.link, '_system', 'location=yes');
        } else if (social == 'pinterest' && post.featured_image) {
            $window.open('http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(post.link) + '&media=' + encodeURIComponent(post.featured_image.guid), '_system', 'location=yes');
        }
        
        return false;
    };
    
    $scope.showPopup = function() {
      
        var facebookButton = '<a class="tab-item button icon-left ion-social-facebook button-positive" ng-click="socialShare(\'facebook\',post)">Facebook</a>';
        var twitterButton = '<a class="tab-item button icon-left ion-social-twitter button-calm" ng-click="socialShare(\'twitter\',post)">Twitter</a>';
        var googleButton = '<a class="tab-item button icon-left ion-social-googleplus button-assertive" ng-click="socialShare(\'google\',post)">Google +</a>';
        
        var pinterestButton = '';
        
        if ($scope.post.featured_image) {
            var pinterestButton = '<a class="tab-item button icon-left ion-social-pinterest button-energized" ng-click="socialShare(\'pinterest\',post)">Pinterest</a>';
        }
          
        var myPopup = $ionicPopup.show({
            title: gettext('Share'),
//            subTitle: 'Aukeratu sarea:',
            template: '<div class="item tabs tabs-secondary tabs-icon-left">'+facebookButton+twitterButton+'</div><div class="item tabs tabs-secondary tabs-icon-left">' + googleButton + pinterestButton + '</div>',
            scope: $scope,
            buttons: [
              { 
                text: gettext('Close')
              }
            ]
        });
    };
    
    
});