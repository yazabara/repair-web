/**
 * Модуль для взаимодествия с элементами при скролле.
 * Соответственно добать класс - когда мы видим элемент, добавить новый/убрать старый - когда не видим.
 *
 * Спасибо: https://github.com/morr/jquery.appear - тспользуется данный плагин.
 */
var Appear = angular.module('Appear', []).directive('appearDirective', ['$window' , function ($window) {
	return {
		restrict: 'A',
		transclude: true,
		template: '<div ng-transclude></div>',
		scope: {
			appearClass: '@',
			disappearClass: '@',
			removeClass: '@'
		},
		link: function ($scope, elem) {
			console.log('link');
			/**
			 * Задает позицию для текущего элемента
			 */
			var appear = function () {
				console.log('appear');
				var appearClass = ($scope.appearClass ? $scope.appearClass : 'appear' );
				var disappearClass = ($scope.disappearClass ? $scope.disappearClass : 'disappear' );
				var removeClass = ($scope.removeClass ? true : false );
				if (removeClass) {
					$(this).removeClass(disappearClass);
				}
				$(this).addClass(appearClass)
			};
			var disappear = function () {
				console.log('disappear');
				var appearClass = ($scope.appearClass ? $scope.appearClass : 'appear' );
				var disappearClass = ($scope.disappearClass ? $scope.disappearClass : 'disappear' );
				var removeClass = ($scope.removeClass ? true : false );
				if (removeClass) {
					$(this).removeClass(appearClass);
				}
				$(this).addClass(disappearClass)
			};

			var initAppearElement = function() {
				console.log('initAppearElement');
				$(elem).appear();
				$(elem).on('appear', appear);
				$(elem).on('disappear', disappear);
			};

			angular.element($window).bind('load', initAppearElement);
		}
	}
}]);