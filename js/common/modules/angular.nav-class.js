/**
 * Модуль для добавления "красивости" для навигатора.
 * Добавляте класс, когда pageYOffset будет больше чем заданный коэффициент.
 */
angular.module('NavigationClass', []).directive('navClassDirective', ['$window', function($window) {
    return {
        restrict: 'A',
        transclude: true,
        template: '<div ng-transclude></div>',
        scope: {
            navClass: '@',
            navRangeCoff: '@'
        },
        link: function($scope, elem) {
            var updateClass = function () {
                var coff = $scope.navRangeCoff ? $scope.navRangeCoff : 1;
                if ($window.pageYOffset > coff && !elem.hasClass($scope.navClass)) {
                    elem.addClass($scope.navClass);
                }
                if (elem.hasClass($scope.navClass) && $window.pageYOffset <= coff) {
                    elem.removeClass($scope.navClass);
                }
            };
            angular.element($window).bind('load', updateClass);
            angular.element($window).bind("scroll", updateClass);
        }
    };
}]);