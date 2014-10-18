/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../app.ts" />
'use strict';
var Ells;
(function (Ells) {
    var TopNavController = (function () {
        function TopNavController($location, authService) {
            this.$location = $location;
            this.authService = authService;
            this.authentication = authService.authentication;
        }
        TopNavController.prototype.logOut = function () {
            this.authService.logOut();
            this.$location.path('/home');
        };
        TopNavController.$inject = ['$location', 'authService'];
        return TopNavController;
    })();
    Ells.TopNavController = TopNavController;
})(Ells || (Ells = {}));

app.controller('topNavController', Ells.TopNavController);
//# sourceMappingURL=topnavController.js.map
