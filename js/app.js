// Ionic Starter App
var wordpressUrl    = '<%= url %>';
var nameApp         = '<%= name %>';
var descriptionApp  = '<%= description %>';
var lang            = '<%= language %>';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('App',
  [
  'ionic',
  'gettext'
  ]
  )

.run(function($ionicPlatform, gettextCatalog) {

  gettextCatalog.setCurrentLanguage(lang);
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.home', {
      url: '/',
      views: {
        'menuContent' :{
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.category', {
      url: '/category/:categoryId/:categoryTitle',
      views: {
        'menuContent' :{
          templateUrl: 'templates/list.html',
          controller: 'showCategoryCtrl'
        }
      }
    })

    .state('app.page', {
      url: '/page/:pageId',
      views: {
        'menuContent' :{
          templateUrl: 'templates/page.html',
          controller: 'showPageCtrl'
        }
      }
    })

    .state('app.post', {
      url: '/post/:postId',
      views: {
        'menuContent' :{
          templateUrl: 'templates/post.html',
          controller: 'showPostCtrl'
        }
      }
    })

    .state('app.search', {
      url: '/search/:searchText',
      views: {
        'menuContent' :{
          templateUrl: 'templates/list.html',
          controller: 'searchCtrl'
        }
      }
    });

    $urlRouterProvider.otherwise('/app/');
});

