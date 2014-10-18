/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../app.ts" />
'use strict';
var Ells;
(function (Ells) {
    var TokensManagerService = (function () {
        function TokensManagerService($http, ngAuthSettings) {
            this.$http = $http;
            this.ngAuthSettings = ngAuthSettings;
        }
        TokensManagerService.Init = function ($http, ngAuthSettings) {
            return new TokensManagerService($http, ngAuthSettings);
        };

        TokensManagerService.prototype.getRefreshTokens = function () {
            var self = this;
            return self.$http.get(self.ngAuthSettings.apiServiceBaseUri + 'api/refreshtokens').then(function (results) {
                return results;
            });
        };

        TokensManagerService.prototype.deleteRefreshTokens = function (tokenid) {
            var self = this;
            return self.$http.delete(self.ngAuthSettings.apiServiceBaseUri + 'api/refreshtokens/?tokenid=' + tokenid).then(function (results) {
                return results;
            });
        };
        return TokensManagerService;
    })();
    Ells.TokensManagerService = TokensManagerService;
})(Ells || (Ells = {}));

app.factory('tokensManagerService', ['$http', 'ngAuthSettings', Ells.TokensManagerService.Init]);
//# sourceMappingURL=tokensManagerService.js.map
