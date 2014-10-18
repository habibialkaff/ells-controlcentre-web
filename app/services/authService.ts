/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularlocalstorage/angularlocalstorage.d.ts" />

'use strict';

module Ells {
    export class AuthService {
        private $http: ng.IHttpService;
        private $q: ng.IQService;
        private localStorageService: ng.localStorage.ILocalStorageService;
        private ngAuthSettings: IAuthSettings

        public static Init($http: ng.IHttpService, $q: ng.IQService, localStorageService: ng.localStorage.ILocalStorageService, ngAuthSettings: IAuthSettings) {
            return new AuthService($http, $q, localStorageService, ngAuthSettings);
        }

        constructor($http: ng.IHttpService, $q: ng.IQService, localStorageService: ng.localStorage.ILocalStorageService, ngAuthSettings: IAuthSettings) {
            this.$http = $http;
            this.$q = $q;
            this.localStorageService = localStorageService;
            this.ngAuthSettings = ngAuthSettings;
            this.authentication = {
                isAuth: false,
                userName: "",
                useRefreshTokens: false
            }
            this.externalAuthData = {
                provider: "",
                userName: "",
                externalAccessToken: ""
            }
        }

        authentication: any;
        externalAuthData: any;

        saveRegistration(registration) {
            var self = this;

            self.logOut();

            return self.$http.post(self.ngAuthSettings.apiServiceBaseUri + 'api/account/register', registration).then(function (response) {
                return response;
            });

        }

        login(loginData) {
            var self = this;

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            if (loginData.useRefreshTokens) {
                data = data + "&client_id=" + self.ngAuthSettings.clientId;
            }

            var deferred = self.$q.defer();

            self.$http.post<any>(self.ngAuthSettings.apiServiceBaseUri + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                if (loginData.useRefreshTokens) {
                    self.localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
                }
                else {
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

        }

        logOut() {
            var self = this;

            self.localStorageService.remove('authorizationData');

            self.authentication.isAuth = false;
            self.authentication.userName = "";
            self.authentication.useRefreshTokens = false;

        }

        fillAuthData() {
            var self = this;
            var authData = self.localStorageService.get('authorizationData');
            if (authData) {
                self.authentication.isAuth = true;
                self.authentication.userName = authData.userName;
                self.authentication.useRefreshTokens = authData.useRefreshTokens;
            }
        }

        refreshToken() {
            var self = this;
            var deferred = self.$q.defer();

            var authData = self.localStorageService.get('authorizationData');

            if (authData) {

                if (authData.useRefreshTokens) {

                    var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + self.ngAuthSettings.clientId;

                    self.localStorageService.remove('authorizationData');

                    self.$http.post<any>(self.ngAuthSettings.apiServiceBaseUri + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                        self.localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

                        deferred.resolve(response);

                    }).error(function (err, status) {
                            self.logOut();
                            deferred.reject(err);
                        });
                }
            }

            return deferred.promise;
        }

        obtainAccessToken(externalData) {
            var self = this;
            var deferred = self.$q.defer();

            self.$http.get<any>(self.ngAuthSettings.apiServiceBaseUri + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

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
        }

        registerExternal(registerExternalData) {
            var self = this;
            var deferred = self.$q.defer();

            self.$http.post<any>(self.ngAuthSettings.apiServiceBaseUri + 'api/account/registerexternal', registerExternalData).success(function (response) {

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

        }        
    }
}

app.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', Ells.AuthService.Init]);