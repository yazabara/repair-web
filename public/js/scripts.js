'use strict';
var repairApp = angular.module('repairApp', ['ui.bootstrap', 'BackgroundParallax', 'Appear']);
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
 * Соответственно добать класс - когда мы видим элемент, добавить новый/убрать старый - когда не видим.
 *
 * Спасибо: https://github.com/morr/jquery.appear - тспользуется данный плагин.
 */
var Appear = angular.module('Appear', []).directive('appear', ['$window' , function ($window) {
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