angular.module('homeCtrl', []).
controller('HomeCtrl', ['$scope', function($scope) {
	$scope.coucou = "hello World!"; 

	$scope.issues = [
		{'name': 'Froid', checked:false},
		{'name': 'Faim', checked:false},
		{'name': 'Soif', checked:false},
		{'name': 'Maladie', checked:false},
		{'name': 'Solitude', checked:false},
	];
}]);
	
