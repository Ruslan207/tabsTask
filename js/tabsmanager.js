var tabApp = angular.module('tabApp', ['ngRoute']);

tabApp.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl : 'content.html',
            controller  : 'tabCtrl'
        })
        .when('/:tabName', {
            templateUrl : 'content.html',
            controller  : 'tabCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});

tabApp.controller('mainCtrl', function ($scope, $location, $routeParams) {
    $scope.selectTab = function (tab){
        $location.path('/'+tab.id);
        $scope.currTab = tab;
    };
    if (!$scope.tabs) {
        $.getJSON('tabs.json', function (data) {
            $scope.tabs = data;
            try {
                $scope.$apply()
            } finally { }
        })
    }
    $scope.$on('setCurrTab', function (event, data) {
        $scope.currTab = data;
    });
});

tabApp.controller('tabCtrl', function ($scope, $location, $routeParams) {
    if (!$scope.tabs){$scope.tabs=[]};
    function compare(a,b) {
        if (a.order < b.order)
            return -1;
        if (a.order > b.order)
            return 1;
        return 0;
    }
    var firstTab = $scope.tabs.sort(compare)[0];
    if (!$routeParams.tabName) {
        $scope.currTab = firstTab;
    } else {
        var tmp = $scope.tabs.filter(function (tab) {
            return tab.id == $routeParams.tabName;
        });
        $scope.currTab = tmp.length > 0 ? tmp[0] : firstTab;
    }
    $scope.$emit('setCurrTab', $scope.currTab);
});