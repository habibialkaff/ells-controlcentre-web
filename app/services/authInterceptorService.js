/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularlocalstorage/angularlocalstorage.d.ts" />
/// <reference path="../app.ts" />
'use strict';
var Ells;
(function (Ells) {
    var AuthInterceptorService = (function () {
        function AuthInterceptorService($injector, $location, $q, localStorageService) {
            var _this = this;
            this.request = function (config) {
                var self = _this;

                config.headers = config.headers || {};

                var authData = self.localStorageService.get('authorizationData');
                if (authData) {
                    config.headers.Authorization = 'Bearer ' + authData.token;
                }

                return config;
            };
            this.responseError = function (rejection) {
                var self = _this;
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
            };
            this.$injector = $injector;
            this.$location = $location;
            this.$q = $q;
            this.localStorageService = localStorageService;
        }
        AuthInterceptorService.Init = function ($injector, $location, $q, localStorageService) {
            return new AuthInterceptorService($injector, $location, $q, localStorageService);
        };
        return AuthInterceptorService;
    })();
    Ells.AuthInterceptorService = AuthInterceptorService;
})(Ells || (Ells = {}));

app.factory('authInterceptorService', ['$injector', '$location', '$q', 'localStorageService', Ells.AuthInterceptorService.Init]);
//# sourceMappingURL=authInterceptorService.js.map
