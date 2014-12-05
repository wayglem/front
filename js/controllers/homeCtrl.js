angular.module('homeCtrl', []).
controller('HomeCtrl', ['$scope', function($scope) {
	$scope.coucou = "hello World!"; 

	$scope.issues = [
		{'name': 'Besoin d\'eau', checked:false},
		{'name': 'Besoin de secours medicaux', checked:false},
		{'name': 'Besoin des forces de l\'ordre', checked:false},
	];
		
	$scope.$watch("issues", function () {
			if ($scope.issues[0].checked){
				displayWater();
			}
			else if ($scope.issues[1].checked){
				displayFire();
			}
			else if ($scope.issues[2].checked){
				displayPolice();
			}
		}, true);
}]);