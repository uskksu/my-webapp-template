/// <reference path="_all.ts" />

/**
 * angular.Module#run の登録対象をまとめたファイルです。
 */

module myApp {
  'use strict';

  export interface IStateService extends ng.ui.IStateService {
    previous    : ng.ui.IState;
    authenticate: boolean;
  }

  @Init
  @Inject('$rootScope', '$state')
  export class StateInit {

    constructor($rootScope: ng.IRootScopeService, $state: IStateService) {
      $rootScope.$on('$stateChangeSuccess', (event: any, nextState: any, nextParams: any, previousState: ng.ui.IState) => {
        $state.previous = previousState;
      });
    }
  }

}
