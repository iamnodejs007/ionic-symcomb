angular.module('symcomb').config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('tabs', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.tpl.html'
        })
        .state('tabs.game', {
            url: '/game',
            views: {
                'game-tab': {
                    templateUrl: 'templates/game.tpl.html',
                    controller: 'GameController'
                } 
            }
        })
        .state('tabs.about', {
            url: '/about',
            views: {
                'about-tab': {
                    templateUrl: 'templates/about.tpl.html',
                } 
            }
        })
        .state('tabs.home', {
            url: '/home',
            views: {
                'home-tab': {
                    templateUrl: 'templates/home.tpl.html'
                } 
            }
        });
        $urlRouterProvider.otherwise('/tab/home');
}]);