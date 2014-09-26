angular.module('ScrollToItem', []).directive('scrollToItem', function () {
	return {
		restrict: 'A',
		scope: {
			scrollTo: "@",
			scrollEffect: "@"
		},
		link: function ($scope, $elm) {
			$elm.on('click', function () {
				$('html,body').animate({
					scrollTop: $($scope.scrollTo).offset().top
				}, $scope.scrollEffect ? $scope.scrollEffect : "slow");
			});
		}
	}
})