"use strict";

module Ells {   
    export class Resource {

        static $inject = ['$resource'];

        constructor(private $resource: ng.resource.IResourceService) {
        }

        public static Employee($resource: ng.resource.IResourceService, ngAuthSettings: IAuthSettings): IEmployeeResource {
            var odataUrl = ngAuthSettings.apiServiceBaseUri + "odata/Employees";
            var resource = $resource("", {},
                {
                    'query': { method: 'GET', url: odataUrl },
                    'get': { method: 'GET', params: { id: "@id" }, url: odataUrl + "(:id)" },
                    'save': { method: "POST", url: odataUrl },
                    'update': { method: 'PUT', params: { id: "@id" }, url: odataUrl + "(:id)" },
                    'remove': { method: 'DELETE', params: { id: "@id" }, url: odataUrl + "(:id)" }
                });

            return <IEmployeeResource>resource;
        }

        public static Client($resource: ng.resource.IResourceService, ngAuthSettings: IAuthSettings): IClientResource {
            var odataUrl = ngAuthSettings.apiServiceBaseUri + "odata/Clients";
            var resource = $resource("", {},
                {
                    'query': { method: 'GET', url: odataUrl },
                    'get': { method: 'GET', params: { id: "@id" }, url: odataUrl + "(:id)" },
                    'save': { method: "POST", url: odataUrl },
                    'update': { method: 'PUT', params: { id: "@id" }, url: odataUrl + "(:id)" },
                    'remove': { method: 'DELETE', params: { id: "@id" }, url: odataUrl + "(:id)" }
                });

            return <IClientResource>resource;
        }

        public static Income($resource: ng.resource.IResourceService, ngAuthSettings: IAuthSettings): IIncomeResource {
            var odataUrl = ngAuthSettings.apiServiceBaseUri + "odata/Incomes";
            var resource = $resource("", {},
                {
                    'query': { method: 'GET', url: odataUrl },
                    'get': { method: 'GET', params: { id: "@id" }, url: odataUrl + "(:id)" },
                    'save': { method: "POST", url: odataUrl },
                    'update': { method: 'PUT', params: { id: "@id" }, url: odataUrl + "(:id)" },
                    'remove': { method: 'DELETE', params: { id: "@id" }, url: odataUrl + "(:id)" }
                });

            return <IIncomeResource>resource;
        }

        public static Job($resource: ng.resource.IResourceService, ngAuthSettings: IAuthSettings): IJobResource {
            var odataUrl = ngAuthSettings.apiServiceBaseUri + "odata/Jobs";
            var resource = $resource("", {},
                {
                    'query': { method: 'GET', url: odataUrl },
                    'get': { method: 'GET', params: { id: "@id" }, url: odataUrl + "(:id)" },
                    'save': { method: "POST", url: odataUrl },
                    'update': { method: 'PUT', params: { id: "@id" }, url: odataUrl + "(:id)" },
                    'remove': { method: 'DELETE', params: { id: "@id" }, url: odataUrl + "(:id)" }
                });

            return <IJobResource>resource;
        }

        public static AssignedEmployee($resource: ng.resource.IResourceService, ngAuthSettings: IAuthSettings): IAssignedEmployeeResource {
            var odataUrl = ngAuthSettings.apiServiceBaseUri + "odata/AssignedEmployees";
            var resource = $resource("", {},
                {
                    'query': { method: 'GET', url: odataUrl },
                    'get': { method: 'GET', params: { id: "@id" }, url: odataUrl + "(:id)" },
                    'save': { method: "POST", url: odataUrl },
                    'update': { method: 'PUT', params: { id: "@id" }, url: odataUrl + "(:id)" },
                    'remove': { method: 'DELETE', params: { id: "@id" }, url: odataUrl + "(:id)" }
                });

            return <IAssignedEmployeeResource>resource;
        }

        public static Package($resource: ng.resource.IResourceService, ngAuthSettings: IAuthSettings): IPackageResource {
            var odataUrl = ngAuthSettings.apiServiceBaseUri + "odata/Packages";
            var resource = $resource("", {},
                {
                    'query': { method: 'GET', url: odataUrl, cache: true }                    
                });

            return <IPackageResource>resource;
        }
    }
}

app.factory('Employee', ['$resource', 'ngAuthSettings', Ells.Resource.Employee]);
app.factory('Client', ['$resource', 'ngAuthSettings', Ells.Resource.Client]);
app.factory('Income', ['$resource', 'ngAuthSettings', Ells.Resource.Income]);
app.factory('Job', ['$resource', 'ngAuthSettings', Ells.Resource.Job]);
app.factory('AssignedEmployee', ['$resource', 'ngAuthSettings', Ells.Resource.AssignedEmployee]);
app.factory('Package', ['$resource', 'ngAuthSettings', Ells.Resource.Package]);



//Employee.get({ id: 12, courseId: 55 });//calls /app/student/?id=12&courseId=55