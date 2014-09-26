workoutApp.controller('GoogleLocationController', ['$scope', 'MapLocationService', 'MessageBox', function ($scope, MapLocation, MessageBox) {

	var addresses = [];

	$scope.getLocation = function (val) {
		MapLocation.getGoogleLocation(val).success(function (data) {
			addresses = data.results;
		}).error(function () {
			MessageBox.addMessage({type: 'danger', msg: 'Google map info loading failed'}, 5000);
		});
		return addresses;
	}
}]);