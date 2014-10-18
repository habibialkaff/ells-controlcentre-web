/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularlocalstorage/angularlocalstorage.d.ts" />
/// <reference path="../app.ts" />

'use strict';

module Ells {
    export class AuthInterceptorService {
        private $injector: ng.auto.IInjectorService
        private $location: ng.ILocationService
        private $q: ng.IQService
        private localStorageService: ng.localStorage.ILocalStorageService

        public static Init($injector: ng.auto.IInjectorService, $location: ng.ILocationService, $q: ng.IQService, localStorageService: ng.localStorage.ILocalStorageService) {
            return new AuthInterceptorService($injector, $location, $q, localStorageService);
        }

        constructor($injector: ng.auto.IInjectorService, $location: ng.ILocationService, $q: ng.IQService, localStorageService: ng.localStorage.ILocalStorageService) {
            this.$injector = $injector;
            this.$location = $location;
            this.$q = $q;
            this.localStorageService = localStorageService;
        }

        request = (config) => {
            var self = this;

            config.headers = config.headers || {};

            var authData = self.localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }

            return config;
        }

        responseError = (rejection) => {
            var self = this;
            if (rejection.status === 401) {
                var authService = self.$injector.get('authService');
                var authData = self.localStorageService.get('authorizationData');

                if (authData) {
                    if (authData.useRefreshTokens) {
                        self.$location.path('/refresh');
                        return self.$q.reject(rejection);
                    }
                }
                authService.logOut();
                self.$location.path('/login');
            }
            return self.$q.reject(rejection);
        }
    }
}

app.factory('authInterceptorService', ['$injector', '$location', '$q', 'localStorageService', Ells.AuthInterceptorService.Init]);