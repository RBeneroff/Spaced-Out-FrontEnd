(function() {
  angular
    .module('FontsApp', ['ui.router', 'jdFontselect'])
    .config(MainRouter);

  MainRouter.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function MainRouter($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html',
    })
    .state('login', {
      url:'/login',
      templateUrl: 'login.html',
    })
    .state('types', {
      url: '/types',
      templateUrl: 'all_types.html',
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'profile.html',
    })
    .state('about', {
      url: '/about',
      templateUrl: 'about.html',
    })
    .state('profile.changePass', {
      url: '/changePass',
      templateUrl: 'changePass.html'
    })

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }); //locationProvider

  } //MainRouter closure
})()
