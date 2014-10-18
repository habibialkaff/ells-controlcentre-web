var app = angular.module('EllsControlCentre', ['ngAnimate', 'ngResource', 'ngRoute', 'ngSanitize', 'LocalStorageModule', 'angular-loading-bar', 'ui.bootstrap']);

app.run([
    '$route', 'authService', function ($route, authService) {
        authService.fillAuthData();
    }]);

app.config([
    'cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }
]);

app.config([
    '$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');

        $httpProvider.defaults.transformResponse.push(function (responseData) {
            var regexIso8601 = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/;

            function convertDateStringsToDates(input) {
                // Ignore things that aren't objects.
                if (!input || typeof input !== "object")
                    return input;

                for (var key in input) {
                    if (!input.hasOwnProperty(key))
                        continue;

                    var value = input[key];
                    var match;

                    // Check for string properties which look like dates.
                    if (typeof value === "string" && (match = value.match(regexIso8601))) {
                        var milliseconds = Date.parse(match[0]);
                        if (!isNaN(milliseconds)) {
                            input[key] = new Date(milliseconds);
                        }
                    } else if (typeof value === "object") {
                        // Recurse into object
                        convertDateStringsToDates(value);
                    }
                }
            }

            convertDateStringsToDates(responseData);
            return responseData;
        });
    }]);

app.config([
    '$locationProvider', '$routeProvider', 'routes', function ($locationProvider, $routeProvider, routes) {
        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.configuration);
        });
        $routeProvider.otherwise({ redirectTo: '/home' });

        $locationProvider.html5Mode(true);
    }]);

app.filter('nfcurrency', [
    '$filter', '$locale', function ($filter, $locale) {
        var currency = $filter('currency'), formats = $locale.NUMBER_FORMATS;
        return function (amount, symbol) {
            var value = currency(amount, symbol);
            if (value) {
                return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '');
            }
        };
    }
]);
//# sourceMappingURL=app.js.map
