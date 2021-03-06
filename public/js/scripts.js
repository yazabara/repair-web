'use strict';
var repairApp = angular.module('repairApp', ['ui.bootstrap', 'BackgroundParallax', 'ScrollToItem' , 'NavigationClass']);
repairApp.controller('GoogleLocationController', ['$scope', 'MapLocationService', 'MessageBox', function ($scope, MapLocation, MessageBox) {

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

            var setPosition = function () {
                var appearClass = ($scope.appearClass ? $scope.appearClass : 'appear' );
                if (isScrolledIntoView(elem) && !elem.hasClass(appearClass)) {
                    $(elem).addClass(appearClass);
                }
            };

            function isScrolledIntoView(element) {
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
/**
 * WordMagic модуль - для преобразования текста. Каждая буква будет выведенена с определенным делэем.
 * magic-word.scss(css) - обязательно @keyframes magic.
 * #красивость
 */

var MagicWord = angular.module('MagicWord', []).directive('magicWordDirective', ['$window', function ($window) {
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
/**
 * Модуль для показа сообщений на страницах.
 */
var MessageBox = angular.module('MessageBox', ['ui.bootstrap']);

MessageBox.service('MessageBox', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

	$rootScope.alerts = [];

	var MessageBoxService = {};

	return MessageBoxService = {

        /**
         * Добавить сообщение.
         * @param msgObj - обьект сообщения, с типом и текстом
         * @param timeout - если есть параметр - то после стольких миллисекунд сообщение автоматически закроется(удалиться)
         */
		addMessage: function (msgObj, timeout) {
			$rootScope.alerts.push({
				msg: msgObj.msg,
				type: msgObj.type,
				close: function () {
					return MessageBoxService.closeMessage(this);
				}
			});

			if (timeout) {
				$timeout(function () {
					MessageBoxService.closeMessage(msgObj);
				}, timeout);
			}
		},

        /**
         * Закрыть сообщение
         * @param alert сообщение, которое необходимо удалить
         * @returns {*}
         */
		closeMessage: function (alert) {
			return this.closeMessageIdx($rootScope.alerts.indexOf(alert));
		},

        /**
         * Закрыть сообщение по необходимому индексу
         * @param index индекс сообщения
         * @returns {Array}
         */
		closeMessageIdx: function (index) {
			return $rootScope.alerts.splice(index, 1);
		}
	};
}]);
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
/**
 * Модуль для отображения Background'a в стиле парралакса (т.е. изменение положения в зависимости от скролла)
 */
angular.module('BackgroundParallax', []).directive('parallaxBackgroundDirective', ['$window', function($window) {
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
//				elem.css({
//					'-webkit-transform' : 'translate3d(0px, ' + calcValY + 'px, 0px);)',
//					'-moz-transform'    : 'translate3d(0px, ' + calcValY + 'px, 0px);)',
//					'-ms-transform'     : 'translate3d(0px, ' + calcValY + 'px, 0px);)',
//					'-o-transform'      : 'translate3d(0px, ' + calcValY + 'px, 0px);)',
//					'transform'         : 'translate3d(0px, ' + calcValY + 'px, 0px);)'
//				});
			};

			angular.element($window).bind('load', setPosition);
			angular.element($window).bind("scroll", setPosition);
			angular.element($window).bind("touchmove", setPosition);
		}
	};
}]);

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