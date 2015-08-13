/// <reference path="_all.ts" />

/**
 * angular.Module#config の登録対象をまとめたファイルです。
 */

module myApp {
  'use strict';

  @Config
  @Inject('$logProvider')
  class LogConfig {

    constructor($logProvider: ng.ILogProvider) {
      $logProvider.debugEnabled(true);
    }
  }

  @Config
  @Inject('toastr')
  class ToastrConfig {

    constructor(toastr: Toastr) {
      toastr.options.timeOut           = 3000;
      toastr.options.positionClass     = 'toast-top-right';
      toastr.options.preventDuplicates = true;
      toastr.options.progressBar       = true;
    }
  }

  @Config
  @Inject('$urlRouterProvider', '$locationProvider')
  class RouteConfig {

    constructor($urlRouterProvider: ng.ui.IUrlRouterProvider, $locationProvider : ng.ILocationProvider) {
      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
    }
  }

  @Config
  @Inject('datepickerConfig', 'datepickerPopupConfig')
  class DatepickerConfig {

    constructor(datepickerConfig : ng.ui.bootstrap.IDatepickerConfig, datepickerPopupConfig: ng.ui.bootstrap.IDatepickerPopupConfig) {
      angular.extend(datepickerConfig, {
        showWeeks: false,
        formatDay: 'd'
      });
      angular.extend(datepickerPopupConfig, {
        currentText: '今日',
        clearText: 'クリア',
        closeText: '閉じる'
      });
    }
  }

}
