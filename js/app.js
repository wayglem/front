"use strict";
// Main app module
var d3App = angular.module('d3App', ['ngTable', 'elasticsearch', 'ngRoute', 'homeCtrl']);

// configure routes
d3App.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/help', {
        templateUrl : 'pages/help.html',
        controller  : 'HomeCtrl'
    });
/*
    .when('/project/:proj', {
        templateUrl : 'pages/support.html',
        controller  : 'SuppCtrl'
    })
    // route for the macro-project's support pages
    .when('/macroproject/:macro', {
        templateUrl : 'pages/macroSupp.html',
        controller  : 'MacroSuppCtrl'
    })

    // route for the about page
    .when('/', {
        templateUrl : 'pages/home.html',
        controller  : 'HomeCtrl'
    })

    // route for the contact page
    .when('/budget', {
        templateUrl : 'pages/budget.html',
        controller  : 'BudgetCtrl'
    })

    .when('/budgetpertime', {
        templateUrl : 'pages/budgetpertime.html',
        controller  : 'BudgetpertimeCtrl'
    })
    //.when('/projectvisualization', {
    //    templateUrl : 'pages/projectvisualization.html',
    //    controller  : 'projectvisualizationCtrl'
    //})
    .when('/tjmpertime', {
        templateUrl : 'pages/tjmpertime.html',
        controller  : 'TjmpertimeCtrl'
    });
*/
}]);
