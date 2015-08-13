module myApp {
  'use strict';

  @Directive('navbar')
  class NavbarDirective {
    restrict = 'E';
    scope = {};
    templateUrl = 'app/components/navbar/navbar.html';
    controller = NavbarController;
    controllerAs = 'vm';
    bindToController = {
      brandName: '@',
      home:      '@'
    };
  }

  @Controller('NavbarController')
  @Inject('$state')
  class NavbarController {

    brandName: string;
    home: string;

    isCollapsed: boolean;

    constructor(private $state: IStateService) {
      this.home = '/';
      this.isCollapsed = true;
    }

    getCurrentUser() {
      return {
        nickname: 'ジョニー'
      };
    }

    isLoggedIn() {
      return true;
    }

    logout() {
      this.$state.go('main');
    }

  }

}
