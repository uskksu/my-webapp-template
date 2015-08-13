/// <reference path="_all.ts" />

/**
 * ルートモジュールファイルです。
 */

module myApp {
  'use strict';

  /** アプリケーションモジュール */
  let app = angular.module('myApp', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap']);

  /** ディレクティブなどに付加するこのアプリケーションを示すプリフィックス */
  let appPrefix = 'my';

  /** サービスを遅延登録するための関数群 */
  let registrants: Function[] = [];

  /**
   * プリフィックスを付加します。
   * @param string
   * @param prefix
   * @returns {string}
   */
  let prependPrefix = (string: string, prefix: string): string => {
    // TODO ここでは lodash に依存すべきでない
    if (_.startsWith(string, prefix)) {
      return string;
    }
    // TODO ここでは lodash に依存すべきでない
    return prefix + _.capitalize(string);
  };

  /**
   * インスタンスを生成します。
   * @param clazz
   * @param args
   * @returns {function(): void}
   */
  let newInstance = (clazz: any, args: any) => {
    let applied = function(): void { // 実行時の this を使いたいのでアローは NG
      clazz.apply(this, args);
    };
    applied.prototype = clazz.prototype;
    return new applied();
  };

  /**
   * アノテーションを付加します。
   * @param clazz
   * @param annotations
   * @returns {Array}
   */
  let annotate = (clazz: any, annotations: string[]) => {
    let result = [];
    result.push.apply(result, annotations);
    result.push(function() {  // arguments を使いたいのでアロー関数は NG
      return newInstance(clazz, arguments)
    });
    return result;
  };

  /**
   * 引数と戻り値のログを出力するメソッドデコレータです。
   * @param target
   * @param name
   * @param descriptor
   * @returns {PropertyDescriptor}
   * @constructor
   */
  export let Log = (target: any, name: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    let delegate = descriptor.value;
    descriptor.value = function() {
      let args: string[] = [];
      for (let i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      console.log(`${name} in: ${args.join()}`);
      let result = delegate.apply(this, arguments);
      console.log(`${name} out: ${result}`);
      return result;
    };
    return descriptor;
  };

  /**
   * 依存性注入時の各コンポーネント名を登録するクラスデコレータです。
   * @param names
   * @returns {function(any): void}
   */
  export let Inject = (...names: string[]): any => {
    return (clazz: any): void => {
      clazz.$inject = names;
    };
  };

  /**
   * モジュールの読み込み時に実行する処理を登録するクラスデコレータです。
   * @param clazz
   * @constructor
   */
  export let Config = (clazz: any) => {
    registrants.push(() => {
      app.config(clazz);
    });
  };

  /**
   * モジュールの読み込みが完了した後に実行する処理を登録するクラスデコレータです。
   * @param clazz
   * @constructor
   */
  export let Init = (clazz: any) => {
    registrants.push(() => {
      app.run(clazz);
    });
  };

  /**
   * ルートを登録するクラスデコレータです。
   * @param name
   * @returns {function(any): void}
   * @constructor
   */
  export let Route = (name: string) => {
    return (clazz: any): void => {
      let config = ($stateProvider: angular.ui.IStateProvider) => {
        $stateProvider.state(name, new clazz());
      };
      Inject('$stateProvider')(config);
      Config(config);
    };
  };

  /**
   * コントローラを登録するクラスデコレータです。
   * @param name
   * @returns {function(any): void}
   * @constructor
   */
  export let Controller = (name: string) => {
    return (clazz: any): void => {
      registrants.push(() => {
        app.controller(name, clazz);
      });
    };
  };

  /**
   * ディレクティブを登録するクラスデコレータです。
   * @param name
   * @returns {function(any): void}
   * @constructor
   */
  export let Directive = (name: string) => {
    return (clazz: any) => {
      registrants.push(() => {
        app.directive(prependPrefix(name, appPrefix), annotate(clazz, clazz.$inject));
      });
    };
  };

  /**
   * angular.Module#constant でサービスを登録するプロパティデコレータです。
   * @param name
   * @returns {function(any, string): void}
   * @constructor
   */
  export let Constant = (name: string) => {
    return (clazz: any, propertyName: string): void => {
      registrants.push(() => {
        app.constant(name, clazz[propertyName]);
      });
    };
  };

  /**
   * angular.Module#value でサービスを登録するプロパティデコレータです。
   * @param name
   * @returns {function(any, string): void}
   * @constructor
   */
  export let Value = (name: string) => {
    return (clazz: any, propertyName: string): void => {
      registrants.push(() => {
        app.value(name, clazz[propertyName]);
      });
    };
  };

  /**
   * angular.Module#service でサービスを登録するクラスデコレータです。
   * @param name
   * @returns {function(any): void}
   * @constructor
   */
  export let Service = (name: string) => {
    return (clazz: any): void => {
      registrants.push(() => {
        app.service(name, clazz);
      });
    };
  };

  /**
   * angular.Module#provider でサービスを登録するクラスデコレータです。
   * @param name
   * @returns {function(any): void}
   * @constructor
   */
  export let Provider = (name: string) => {
    return (clazz: any): void => {
      registrants.push(() => {
        app.provider(name, clazz);
      });
    };
  };

  /**
   * アプリケーションを起動します。
   */
  export let run = () => {
    registrants.forEach((registrant: Function) => {
      registrant();
    });
  };

}
