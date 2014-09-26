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