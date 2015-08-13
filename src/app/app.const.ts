/// <reference path="_all.ts" />

/**
 * angular.Module#constant の登録対象をまとめたファイルです。
 */

declare var toastr: Toastr;
declare var moment: moment.MomentStatic;
declare var _: _.LoDashStatic;

module myApp {
  'use strict';

  export class Constants {

    @Constant('toastr')
    static toastr = toastr;

    @Constant('moment')
    static moment = moment;

    @Constant('_')
    static _ = _;

    @Constant('apiHost')
    static apiHost = 'http://localhost:8080/';

  }

}
