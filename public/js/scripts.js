'use strict';

/**
 * first must loaded workoutApp
 */
var workoutApp = angular.module('workoutApp', ['ui.bootstrap', 'AccountService',
	'SettingsService', 'TrainingService', 'MessageBox', 'BackgroundParallax', 'ScrollToItem', 'MapLocation', 'MagicWord']);

var repairApp = angular.module('repairApp', ['ui.bootstrap', 'BackgroundParallax', 'Appear']);

//$(function() {
//	$('.qwe').appear();
//	$('.qwe').on('appear', function(event, $all_appeared_elements) {
//		console.log("appear");
//		$(this).addClass("appear").removeClass("disappear");
//	});
//	$('.qwe').on('disappear', function(event, $all_disappeared_elements) {
//		console.log("disappear");
//		$(this).addClass("disappear").removeClass("appear");
//	});
//});
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

workoutApp.controller('myAccountController', ['$scope', 'AccountService', 'SettingsService', 'MessageBox', function ($scope, AccountService, SettingsService, MessageBox) {
	$scope.myAccount = {};
	$scope.mySettings = {};

	AccountService.getAccount(1).success(function (data) {
		$scope.myAccount = {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			password: data.password,
			confirmPassword: data.password
		};
		MessageBox.addMessage({type: 'success', msg: 'account info loaded'} , 3000);
	}).error(function (data) {
		MessageBox.addMessage({type: 'danger', msg: 'account info loading failed'});
	});

	SettingsService.getAccountSettings(1).success(function (data) {
		$scope.mySettings = {
			showFirstName: data.publicFirstName,
			showLastName: data.publicLastName,
			showEmail: data.publicEmail
		};
		MessageBox.addMessage({type: 'success', msg: 'account settings info loaded'}, 3500);
	}).error(function (data) {
		MessageBox.addMessage({type: 'danger', msg: 'account settings info loading failed'});
	});

}]);
workoutApp.filter('startFrom', function () {
	return function (input, start) {
		start = +start;
		return input.slice(start);
	};
});

workoutApp.controller('myAccountTrainingListController', ['$scope' , '$http', '$filter', 'TrainingService', 'MessageBox' , function ($scope, $http, $filter, TrainingService, MessageBox) {
	$scope.trainingList = [];
	$scope.filtredTrainingList = [];
	$scope.currentPage = 1;
	//TODO магия с 10 - пагинация норм работает только с 10.
	$scope.pageSize = 10;
	$scope.trainingQuery = "";

	$scope.$watch('trainingQuery', function () {
		$scope.currentPage = 1;
		$scope.filtredTrainingList = $filter('filter')($scope.trainingList, $scope.trainingQuery);
		$scope.pageNum = $scope.filtredTrainingList.length / $scope.pageSize;
	});

	TrainingService.getProgramList(1).success(function (data) {
		$scope.trainingList = data;

		$scope.currentPage = 1;
		$scope.filtredTrainingList = $filter('filter')($scope.trainingList, $scope.trainingQuery);
		$scope.pageNum = $scope.filtredTrainingList.length / $scope.pageSize;

		MessageBox.addMessage({type: 'success', msg: 'training list  loading failed'}, 4000);

	}).error(function (data) {
		MessageBox.addMessage({type: 'danger', msg: 'training list  loading failed'});
	});

}]);
var AccountService = angular.module('AccountService', ['ngResource']);
//ngResource - можно переписать потом через $resource

AccountService.service('AccountService', ['$http', function ($http) {

	var accountService = "http://localhost:8180/web-services/accountService/";

	this.getAccount = function (id) {
		return $http.get(accountService + "account/" + id);
	};

	this.removeAccount = function(id) {
		return $http.delete(accountService + "removeAccount/" + id);
	};

	this.addAccount = function(account) {
		return $http.post(accountService + "addAccount", account);
	};

	this.getAccountList = function () {
		return $http.get(accountService + "accounts");
	};

}]);
var MapLocation = angular.module('MapLocation', []);

AccountService.service('MapLocationService', ['$http', function ($http) {

	var googleService = 'http://maps.googleapis.com/maps/api/geocode/json';

	this.getGoogleLocation = function (val) {
		return $http.get(googleService, {
			params: {
				address: val,
				sensor: false
			}
		});
	}
}]);
var SettingsService = angular.module('SettingsService', ['ngResource']);
//ngResource - можно переписать потом через $resource

SettingsService.service('SettingsService', ['$http', function ($http) {

	var settingsService = "http://localhost:8180/web-services/settingsService/";

	this.getAccountSettings = function (id) {
		return $http.get(settingsService + "account/" + id);
	};
}]);
var TrainingService = angular.module('TrainingService', ['ngResource']);
//ngResource - можно переписать потом через $resource

AccountService.service('TrainingService', ['$http', function ($http) {

    var trainingService = "http://localhost:8180/web-services/trainingProgram/";

    this.getProgram = function (id) {
        return $http.get(trainingService + "program/" + id);
    };

    this.getProgramList = function (ownerId) {
        return $http.get(trainingService + "programList/" + ownerId);
    };

}]);