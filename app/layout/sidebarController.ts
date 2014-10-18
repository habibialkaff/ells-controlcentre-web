/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../app.ts" />
'use strict';

module Ells {

    export class SidebarController {
        private $route: ng.route.IRouteService
        private $sce: ng.ISCEService
        private routes: Ells.IRouteConstant[]

        static $inject = ['$route', '$sce', 'routes'];

        constructor($route: ng.route.IRouteService, $sce: ng.ISCEService, routes: IRouteConstant[]) {
            this.$route = $route;
            this.$sce = $sce;
            this.routes = routes;
            this.getNavRoutes();
        }

        navRoutes: any

        isCurrent(route: IRouteConstant) {
            var currentRoute = <IRouteConfig>this.$route.current;
            if (!route.configuration.title || !this.$route.current || !currentRoute.title) {
                return '';
            }
            var menuName = route.configuration.title;
            return currentRoute.title.substr(0, menuName.length) === menuName ? 'active' : '';
        }

        private getNavRoutes() {
            this.navRoutes = (<any>this.routes).filter(function(r : Ells.IRouteConstant) {
                return r.configuration.settings && r.configuration.settings.nav;
            }).sort(function (r1: Ells.IRouteConstant, r2: Ells.IRouteConstant) {
                return r1.configuration.settings.nav - r2.configuration.settings.nav;
            });
        }
    }
}

app.controller('sidebarController', Ells.SidebarController);