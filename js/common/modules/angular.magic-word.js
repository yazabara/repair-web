/**
 * WordMagic модуль - для преобразования текста. Каждая буква будет выведенена с определенным делэем.
 * magic-word.scss(css) - обязательно @keyframes magic.
 * #красивость
 */

var MagicWord = angular.module('MagicWord', []).directive('magicWord', ['$window', function ($window) {
    return {
        restrict: 'A',
        transclude: true,
        template: '<div ng-transclude></div>',
        scope: {
            wordDelay: '@',
            wordStart: '@'
        },
        link: function ($scope, elem) {

            var setPosition = function () {
                var text = $(elem).text();
                elem.text("").addClass('magic-word-container');

                var delay = ($scope.wordDelay ? $scope.wordDelay : 1 );
                var start = ($scope.wordStart ? $scope.wordStart : 1 );

                for (var i = 0; i < text.length; i++) {
                    var step = start + (delay * i);
                    $(elem).append('<span class="chr' + i + '" style="-webkit-animation-delay: ' + step + 's; -moz-animation-delay: ' + step + 's; -ms-animation-delay: ' + step + 's; animation-delay: ' + step + 's;">' + text[i] + '</span>')
                }
            };
            angular.element($window).bind('load', setPosition);
        }
    };
}]);