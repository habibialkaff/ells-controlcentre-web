"use strict";
var Ells;
(function (Ells) {
    var Resource = (function () {
        function Resource($resource) {
            this.$resource = $resource;
        }
        Resource.Employee = function ($resource, ngAuthSettings) {
            var odataUrl = ngAuthSettings.apiServiceBaseUri + "odata/Employees";
            var resource = $resource("", {}, {
                'query': { method: 'GET', url: odataUrl },
                'get': { method: 'GET', params: { id: "@id" }, url: odataUrl + "(:id)" },
                'save': { method: "POST", url: odataUrl },
                'update': { method: 'PUT', params: { id: "@id" }, url: odataUrl + "(:id)" },
                'remove': { method: 'DELETE', params: { id: "@id" }, url: odataUrl + "(:id)" }
            });

            return resource;
        };

        Resource.Client = function ($resource, ngAuthSettings) {
            var odataUrl = ngAuthSettings.apiServiceBaseUri + "odata/Clients";
            var resource = $resource("", {}, {
                'query': { method: 'GET', url: odataUrl },
                'get': { method: 'GET', params: { id: "@id" }, url: odataUrl + "(:id)" },
                'save': { method: "POST", url: odataUrl },
                'update': { method: 'PUT', params: { id: "@id" }, url: odataUrl + "(:id)" },
                'remove': { method: 'DELETE', params: { id: "@id" }, url: odataUrl + "(:id)" }
            });

            return resource;
        };

        Resource.Income = function ($resource, ngAuthSettings) {
            var odataUrl = ngAuthSettings.apiServiceBaseUri + "odata/Incomes";
            var resource = $resource("", {}, {
                'query': { method: 'GET', url: odataUrl },
                'get': { method: 'GET', params: { id: "@id" }, url: odataUrl + "(:id)" },
                'save': { method: "POST", url: odataUrl },
                'update': { method: 'PUT', params: { id: "@id" }, url: odataUrl + "(:id)" },
                'remove': { method: 'DELETE', params: { id: "@id" }, url: odataUrl + "(:id)" }
            });

            return resource;
        };

        Resource.Job = function ($resource, ngAuthSettings) {
            var odataUrl = ngAuthSettings.apiServiceBaseUri + "odata/Jobs";
            var resource = $resource("", {}, {
                'query': { method: 'GET', url: odataUrl },
                'get': { method: 'GET', params: { id: "@id" }, url: odataUrl + "(:id)" },
                'save': { method: "POST", url: odataUrl },
                'update': { method: 'PUT', params: { id: "@id" }, url: odataUrl + "(:id)" },
                'remove': { method: 'DELETE', params: { id: "@id" }, url: odataUrl + "(:id)" }
            });

            return resource;
        };

        Resource.AssignedEmployee = function ($resource, ngAuthSettings) {
            var odataUrl = ngAuthSettings.apiServiceBaseUri + "odata/AssignedEmployees";
            var resource = $resource("", {}, {
                'query': { method: 'GET', url: odataUrl },
                'get': { method: 'GET', params: { id: "@id" }, url: odataUrl + "(:id)" },
                'save': { method: "POST", url: odataUrl },
                'update': { method: 'PUT', params: { id: "@id" }, url: odataUrl + "(:id)" },
                'remove': { method: 'DELETE', params: { id: "@id" }, url: odataUrl + "(:id)" }
            });

            return resource;
        };

        Resource.Package = function ($resource, ngAuthSettings) {
            var odataUrl = ngAuthSettings.apiServiceBaseUri + "odata/Packages";
            var resource = $resource("", {}, {
                'query': { method: 'GET', url: odataUrl, cache: true }
            });

            return resource;
        };
        Resource.$inject = ['$resource'];
        return Resource;
    })();
    Ells.Resource = Resource;
})(Ells || (Ells = {}));

app.factory('Employee', ['$resource', 'ngAuthSettings', Ells.Resource.Employee]);
app.factory('Client', ['$resource', 'ngAuthSettings', Ells.Resource.Client]);
app.factory('Income', ['$resource', 'ngAuthSettings', Ells.Resource.Income]);
app.factory('Job', ['$resource', 'ngAuthSettings', Ells.Resource.Job]);
app.factory('AssignedEmployee', ['$resource', 'ngAuthSettings', Ells.Resource.AssignedEmployee]);
app.factory('Package', ['$resource', 'ngAuthSettings', Ells.Resource.Package]);
//Employee.get({ id: 12, courseId: 55 });//calls /app/student/?id=12&courseId=55
//# sourceMappingURL=resources.js.map
