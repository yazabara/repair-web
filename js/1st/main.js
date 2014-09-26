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