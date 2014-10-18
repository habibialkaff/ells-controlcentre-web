/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../app.ts" />
'use strict';

module Ells {

    export class TopNavController {        
        private $location: ng.ILocationService    
        private authService: Ells.AuthService

        static $inject = ['$location', 'authService'];

        constructor($location: ng.ILocationService, authService: Ells.AuthService) {
            this.$location = $location;
            this.authService = authService;
            this.authentication = authService.authentication;
        }

        authentication: any

        logOut() {
            this.authService.logOut();
            this.$location.path('/home');
        }
    }
}

app.controller('topNavController', Ells.TopNavController); 