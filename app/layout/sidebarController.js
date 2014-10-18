/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../app.ts" />
'use strict';
var Ells;
(function (Ells) {
    var SidebarController = (function () {
        function SidebarController($route, $sce, routes) {
            this.$route = $route;
            this.$sce = $sce;
            this.routes = routes;
            this.getNavRoutes();
        }
        SidebarController.prototype.isCurrent = function (route) {
            var currentRoute = this.$route.current;
            if (!route.configuration.title || !this.$route.current || !currentRoute.title) {
                return '';
            }
            var menuName = route.configuration.title;
            return currentRoute.title.substr(0, menuName.length) === menuName ? 'active' : '';
        };

        SidebarController.prototype.getNavRoutes = function () {
            this.navRoutes = this.routes.filter(function (r) {
                return r.configuration.settings && r.configuration.settings.nav;
            }).sort(function (r1, r2) {
                return r1.configuration.settings.nav - r2.configuration.settings.nav;
            });
        };
        SidebarController.$inject = ['$route', '$sce', 'routes'];
        return SidebarController;
    })();
    Ells.SidebarController = SidebarController;
})(Ells || (Ells = {}));

app.controller('sidebarController', Ells.SidebarController);
//# sourceMappingURL=sidebarController.js.map
