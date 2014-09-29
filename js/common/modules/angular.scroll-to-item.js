angular.module('ScrollToItem', []).directive('scrollToItem', function () {
	return {
		restrict: 'A',
		scope: {
			scrollTo: "@",
			scrollEffect: "@",
            scrollCoff: "@"
		},
		link: function ($scope, $elm) {
			$elm.on('click', function () {
                var coff = parseInt($scope.scrollCoff ? $scope.scrollCoff : 0);
				$('html,body').animate({
					scrollTop: $($scope.scrollTo).offset().top + coff
				}, $scope.scrollEffect ? $scope.scrollEffect : "slow");
			});
		}
	}
})