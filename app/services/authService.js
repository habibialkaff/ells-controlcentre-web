/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularlocalstorage/angularlocalstorage.d.ts" />
'use strict';
var Ells;
(function (Ells) {
    var AuthService = (function () {
        function AuthService($http, $q, localStorageService, ngAuthSettings) {
            this.$http = $http;
            this.$q = $q;
            this.localStorageService = localStorageService;
            this.ngAuthSettings = ngAuthSettings;
            this.authentication = {
                isAuth: false,
                userName: "",
                useRefreshTokens: false
            };
            this.externalAuthData = {
                provider: "",
                userName: "",
                externalAccessToken: ""
            };
        }
        AuthService.Init = function ($http, $q, localStorageService, ngAuthSettings) {
            return new AuthService($http, $q, localStorageService, ngAuthSettings);
        };

        AuthService.prototype.saveRegistration = function (registration) {
            var self = this;

            self.logOut();

            return self.$http.post(self.ngAuthSettings.apiServiceBaseUri + 'api/account/register', registration).then(function (response) {
                return response;
            });
        };

        AuthService.prototype.login = function (loginData) {
            var self = this;

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            if (loginData.useRefreshTokens) {
                data = data + "&client_id=" + self.ngAuthSettings.clientId;
            }

            var deferred = self.$q.defer();

            self.$http.post(self.ngAuthSettings.apiServiceBaseUri + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                if (loginData.useRefreshTokens) {
                    self.localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
                } else {
                    self.localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
                }
                self.authentication.isAuth = true;
                self.authentication.userName = loginData.userName;
                self.authentication.useRefreshTokens = loginData.useRefreshTokens;

                deferred.resolve(response);
            }).error(function (err, status) {
                self.logOut();
                deferred.reject(err);
            });

            return deferred.promise;
        };

        AuthService.prototype.logOut = function () {
            var self = this;

            self.localStorageService.remove('authorizationData');

            self.authentication.isAuth = false;
            self.authentication.userName = "";
            self.authentication.useRefreshTokens = false;
        };

        AuthService.prototype.fillAuthData = function () {
            var self = this;
            var authData = self.localStorageService.get('authorizationData');
            if (authData) {
                self.authentication.isAuth = true;
                self.authentication.userName = authData.userName;
                self.authentication.useRefreshTokens = authData.useRefreshTokens;
            }
        };

        AuthService.prototype.refreshToken = function () {
            var self = this;
            var deferred = self.$q.defer();

            var authData = self.localStorageService.get('authorizationData');

            if (authData) {
                if (authData.useRefreshTokens) {
                    var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + self.ngAuthSettings.clientId;

                    self.localStorageService.remove('authorizationData');

                    self.$http.post(self.ngAuthSettings.apiServiceBaseUri + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                        self.localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

                        deferred.resolve(response);
                    }).error(function (err, status) {
                        self.logOut();
                        deferred.reject(err);
                    });
                }
            }

            return deferred.promise;
        };

        AuthService.prototype.obtainAccessToken = function (externalData) {
            var self = this;
            var deferred = self.$q.defer();

            self.$http.get(self.ngAuthSettings.apiServiceBaseUri + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {
                self.localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

                self.authentication.isAuth = true;
                self.authentication.userName = response.userName;
                self.authentication.useRefreshTokens = false;

                deferred.resolve(response);
            }).error(function (err, status) {
                self.logOut();
                deferred.reject(err);
            });

            return deferred.promise;
        };

        AuthService.prototype.registerExternal = function (registerExternalData) {
            var self = this;
            var deferred = self.$q.defer();

            self.$http.post(self.ngAuthSettings.apiServiceBaseUri + 'api/account/registerexternal', registerExternalData).success(function (response) {
                self.localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

                self.authentication.isAuth = true;
                self.authentication.userName = response.userName;
                self.authentication.useRefreshTokens = false;

                deferred.resolve(response);
            }).error(function (err, status) {
                self.logOut();
                deferred.reject(err);
            });

            return deferred.promise;
        };
        return AuthService;
    })();
    Ells.AuthService = AuthService;
})(Ells || (Ells = {}));

app.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', Ells.AuthService.Init]);
//# sourceMappingURL=authService.js.map
