/**
 * Модуль для отображения Background'a в стиле парралакса (т.е. изменение положения в зависимости от скролла)
 */
angular.module('BackgroundParallax', []).directive('parallaxBackground', ['$window', function($window) {
	return {
		restrict: 'A',
		transclude: true,
		template: '<div ng-transclude></div>',
		scope: {
			parallaxRatio: '@',
			parallaxSign: '@'
		},
		link: function($scope, elem) {
			/**
			 * Задает позицию для текущего элемента
			 */
			var setPosition = function () {
				var sign = ($scope.parallaxSign ? $scope.parallaxSign : -1 );
				var speed = ($scope.parallaxRatio ? $scope.parallaxRatio : 1.1 );
				var start = (elem.prop('offsetTop') - $window.pageYOffset);
				var calcValY = sign * (start * speed);
				//эффект параллакса задается с помощью свойства background-position
				elem.css('background-position', "50% " + calcValY + "px");
			};

			angular.element($window).bind('load', setPosition);
			angular.element($window).bind("scroll", setPosition);
			angular.element($window).bind("touchmove", setPosition);
		}
	};
}]);
