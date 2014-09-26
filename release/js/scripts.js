"use strict";var repairApp=angular.module("repairApp",["ui.bootstrap","BackgroundParallax","Appear"]);workoutApp.controller("GoogleLocationController",["$scope","MapLocationService","MessageBox",function(a,b,c){var d=[];a.getLocation=function(a){return b.getGoogleLocation(a).success(function(a){d=a.results}).error(function(){c.addMessage({type:"danger",msg:"Google map info loading failed"},5e3)}),d}}]);var Appear=angular.module("Appear",[]).directive("appear",["$window",function(a){return{restrict:"A",transclude:!0,template:"<div ng-transclude></div>",scope:{appearClass:"@",disappearClass:"@",removeClass:"@"},link:function(b,c){console.log("link");var d=function(){console.log("appear");var a=b.appearClass?b.appearClass:"appear",c=b.disappearClass?b.disappearClass:"disappear",d=b.removeClass?!0:!1;d&&$(this).removeClass(c),$(this).addClass(a)},e=function(){console.log("disappear");var a=b.appearClass?b.appearClass:"appear",c=b.disappearClass?b.disappearClass:"disappear",d=b.removeClass?!0:!1;d&&$(this).removeClass(a),$(this).addClass(c)},f=function(){console.log("initAppearElement"),$(c).appear(),$(c).on("appear",d),$(c).on("disappear",e)};angular.element(a).bind("load",f)}}}]),MagicWord=angular.module("MagicWord",[]).directive("magicWord",["$window",function(a){return{restrict:"A",transclude:!0,template:"<div ng-transclude></div>",scope:{wordDelay:"@",wordStart:"@"},link:function(b,c){var d=function(){var a=$(c).text();c.text("").addClass("magic-word-container");for(var d=b.wordDelay?b.wordDelay:1,e=b.wordStart?b.wordStart:1,f=0;f<a.length;f++){var g=e+d*f;$(c).append('<span class="chr'+f+'" style="-webkit-animation-delay: '+g+"s; -moz-animation-delay: "+g+"s; -ms-animation-delay: "+g+"s; animation-delay: "+g+'s;">'+a[f]+"</span>")}};angular.element(a).bind("load",d)}}}]),MessageBox=angular.module("MessageBox",["ui.bootstrap"]);MessageBox.service("MessageBox",["$rootScope","$timeout",function(a,b){a.alerts=[];var c={};return c={addMessage:function(d,e){a.alerts.push({msg:d.msg,type:d.type,close:function(){return c.closeMessage(this)}}),e&&b(function(){c.closeMessage(d)},e)},closeMessage:function(b){return this.closeMessageIdx(a.alerts.indexOf(b))},closeMessageIdx:function(b){return a.alerts.splice(b,1)}}}]),angular.module("BackgroundParallax",[]).directive("parallaxBackground",["$window",function(a){return{restrict:"A",transclude:!0,template:"<div ng-transclude></div>",scope:{parallaxRatio:"@",parallaxSign:"@"},link:function(b,c){var d=function(){var d=b.parallaxSign?b.parallaxSign:-1,e=b.parallaxRatio?b.parallaxRatio:1.1,f=c.prop("offsetTop")-a.pageYOffset,g=d*f*e;c.css("background-position","50% "+g+"px")};angular.element(a).bind("load",d),angular.element(a).bind("scroll",d),angular.element(a).bind("touchmove",d)}}}]),angular.module("ScrollToItem",[]).directive("scrollToItem",function(){return{restrict:"A",scope:{scrollTo:"@",scrollEffect:"@"},link:function(a,b){b.on("click",function(){$("html,body").animate({scrollTop:$(a.scrollTo).offset().top},a.scrollEffect?a.scrollEffect:"slow")})}}});