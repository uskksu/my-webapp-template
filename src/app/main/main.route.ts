/// <reference path="../_all.ts" />

/**
 * main サブモジュールのルーティングファイルです。
 */

module myApp {
  'use strict';

  @Route('main')
  class MainRoute {
    url = '/';
    templateUrl  = 'app/main/main.html';
    controller   = 'MainController';
    controllerAs = 'main';
  }

}
