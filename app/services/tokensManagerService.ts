/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../app.ts" />
'use strict';

module Ells {
    export class TokensManagerService {
        private $http: ng.IHttpService
        private ngAuthSettings: IAuthSettings

        public static Init($http: ng.IHttpService, ngAuthSettings: IAuthSettings) {
            return new TokensManagerService($http, ngAuthSettings);
        }

        constructor($http: ng.IHttpService, ngAuthSettings: IAuthSettings) {
            this.$http = $http;
            this.ngAuthSettings = ngAuthSettings;
        }

        getRefreshTokens() {
            var self = this;
            return self.$http.get(self.ngAuthSettings.apiServiceBaseUri + 'api/refreshtokens').then(function (results) {
                return results;
            });
        }

        deleteRefreshTokens(tokenid) {
            var self = this;
            return self.$http.delete(self.ngAuthSettings.apiServiceBaseUri + 'api/refreshtokens/?tokenid=' + tokenid).then(function (results) {
                return results;
            });
        }
    }    
}

app.factory('tokensManagerService', ['$http','ngAuthSettings', Ells.TokensManagerService.Init]);