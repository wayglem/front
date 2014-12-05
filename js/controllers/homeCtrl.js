angular.module('homeCtrl', []).
controller('HomeCtrl', ['$scope', function($scope) {
	$scope.coucou = "hello World!"; 

	$scope.issues = [
		{'name': 'Besoin d\'eau', checked:false},
		{'name': 'Besoin de secours medicaux', checked:false},
		{'name': 'Besoin des forces de l\'ordre', checked:false},
	];
		
	$scope.$watch("radioButton", function () {
		console.log("watched")
			if ($scope.issues[0].name == $scope.radioButton){
				console.log("coucou");
				displayWater();
			}
			else if ($scope.issues[1].name == $scope.radioButton){
				displayFire();
			}
			else if ($scope.issues[2].name == $scope.radioButton){
				displayPolice();
			}
		});
}]);