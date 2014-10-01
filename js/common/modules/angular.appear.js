/**
 * Модуль для взаимодествия с элементами при скролле.
 * Соответственно добать класс - когда мы видим элемент.
 *
 */
var Appear = angular.module('Appear', []).directive('appearDirective', ['$window' , function ($window) {
	return {
		restrict: 'A',
		transclude: true,
		template: '<div ng-transclude></div>',
		scope: {
			appearClass: '@'
		},
		link: function ($scope, elem) {

            var setPosition = function() {
                var appearClass = ($scope.appearClass ? $scope.appearClass : 'appear' );
                if (isScrolledIntoView(elem) && !elem.hasClass(appearClass)) {
                    $(elem).addClass(appearClass);
                }
            };

            function isScrolledIntoView(element)
            {
                //screen box
                var docViewTop = $($window).scrollTop();
                var docViewBottom = docViewTop + $window.innerHeight;
                //element box
                var elemTop = $(element).offset().top;
                var elemBottom = elemTop + $(element).height();

                return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
            }

			angular.element($window).bind('load', setPosition);
            angular.element($window).bind("scroll", setPosition);

		}
	}
}]);