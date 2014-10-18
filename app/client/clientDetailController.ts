/// <reference path="../../scripts/typings/lodash/lodash.d.ts" />
/// <reference path="../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
'use strict';

module Ells {

    export class ClientDetailController {                
        private Client: Ells.IClientResource
        private $location: ng.ILocationService
        private $modal: ng.ui.bootstrap.IModalService

        client: Ells.IClient
        employees: Ells.IEmployee[]
        packages: Ells.IPackage[]
        packageEdit: any
        isEditMode: boolean

        static $inject = ['$location', '$modal', '$routeParams', '$q', '$scope', 'Client', 'Employee', 'Package'];

        constructor($location: ng.ILocationService, $modal: ng.ui.bootstrap.IModalService, $routeParams: ng.route.IRouteParamsService, $q: ng.IQService, $scope: ng.IScope, Client: Ells.IClientResource, Employee: Ells.IEmployeeResource, Package: Ells.IPackageResource) {
            this.Client = Client;
            this.$location = $location;
            this.$modal = $modal;

            var id = $routeParams["id"];

            var clientQ = Client.get({ 'id': id, '$expand': 'incomes,jobs($expand=assignedEmployees)' });
            var employeeQ = Employee.query();
            var packageQ = Package.query();

            var vm = this;

            $q.all([clientQ.$promise, employeeQ.$promise, packageQ.$promise]).then((result) => {
                vm.employees = result[1].value;
                vm.packages = result[2].value;

                var client = <Ells.IClient>result[0];

                client.jobs.forEach((job) => {
                    job.assignedEmployees.forEach((assignedEmplyee) => {
                        assignedEmplyee.employee = _.find(vm.employees, (ee) => ee.id == assignedEmplyee.employeeId);
                    });
                });

                vm.client = client;
            });

            $('#switchMode').bootstrapToggle({
                on: 'View',
                off: 'Edit'
            });
            $('#otherMode').text('Edit');

            $('#switchMode').change(function () {
                if ($(this).prop('checked')) {
                    $('#otherMode').text('Edit');
                    vm.isEditMode = false;
                } else {
                    $('#otherMode').text('View');
                    vm.isEditMode = true;
                }

                $scope.$apply();
            });
        }

        editPackage() {
            this.packageEdit = {
                selectedPackage: this.client.selectedPackage,
                packageItems: _.cloneDeep(this.client.packageItems)
            }
        }

        changePackage() {
            var pckg = _.find(this.packages, (item) => {
                return item.name == this.packageEdit.selectedPackage;
            });
            this.packageEdit.packageItems = _.cloneDeep(pckg.items);
        }

        cancelPackageEdit() {
            this.packageEdit = null;
        }

        updatePackage() {
            this.client.selectedPackage = this.packageEdit.selectedPackage;
            this.client.packageItems = _.cloneDeep(this.packageEdit.packageItems);

            this.update();
        }

        addItem(items) {
            items.push({});
        }

        removeItem(items, index) {
            items.splice(index, 1);
        }

        edit() {
            this.client.isEdit = true;
        }

        cancel() {
            this.client.isEdit = false;
        }

        update() {
            this.Client.update(this.client);
            this.client.isEdit = false;
            this.packageEdit = false;
        }

        remove() {
            var modalInstance = this.$modal.open({
                templateUrl: 'deleteClientModal.html',
                controller: 'deleteModalController'
            });

            modalInstance.result.then(status => {
                if (status) {
                    this.Client.remove({}, this.client, () => {
                        this.$location.path('/client'); 
                    });                    
                }
            }, reason => {
            });
        }
    }

    export class IncomeEditController {
        private Income: Ells.IIncomeResource

        incomeEdit: Ells.IIncome
        isDpOpened: boolean

        static $inject = ['Income'];

        constructor(Income: Ells.IIncomeResource) {
            this.Income = Income;
        }

        openDp($event) {
            $event.preventDefault();
            $event.stopPropagation();

            this.isDpOpened = true;
        }

        edit(clientId: number, income: Ells.IIncome) {
            if (income) {
                this.incomeEdit = income;
            } else {
                this.incomeEdit = <Ells.IIncome>{
                    paymentType: 'Cash',
                    clientId: clientId
                }
            }
        }

        save(incomes) {
            if (this.incomeEdit.id) {
                this.Income.update(this.incomeEdit);
                this.incomeEdit = null;
            } else {
                this.Income.save(this.incomeEdit, () => {
                    var newIncome = _.cloneDeep(this.incomeEdit);
                    incomes.push(newIncome);

                    this.incomeEdit = null;
                });
            }
        }

        cancel() {
            this.incomeEdit = null;
        }
    }

    export class JobEditController {        
        private Job: Ells.IJobResource

        newJob: Ells.IJob

        employees: Ells.IEmployee[]
        isDpOpened: boolean

        static $inject = ['Job'];

        constructor(Job: Ells.IJobResource) {
            this.Job = Job;
        }

        openDp($event) {
            $event.preventDefault();
            $event.stopPropagation();

            this.isDpOpened = true;
        }

        add(clientId: number) {
            this.newJob = <Ells.IJob>{
                clientId: clientId
            }
        }

        edit(job: Ells.IJob) {
            job.isEdit = true;
        }

        save(jobs: Ells.IJob[], job: Ells.IJob) {
            if (job.id) {
                this.Job.update(job);
                job.isEdit = false;
            } else {
                this.Job.save(job, (success) => {
                    job.id = success.id;
                    jobs.push(job);

                    this.newJob = null;
                });
            }
        }

        remove(jobs: Ells.IJob[], job: Ells.IJob) {
            this.Job.remove({}, job);
            _.remove(jobs, (item: Ells.IJob) => item.id == job.id);
        }

        cancel(job: Ells.IJob) {
            if (job.id) {
                job.isEdit = false;
            } else {
                this.newJob = null;
            }
        }
    }

    export class AssignedEmployeeEditController {        
        private AssignedEmployee: Ells.IAssignedEmployeeResource

        newAssignedEmployee: Ells.IAssignedEmployee

        employees: Ells.IEmployee[]

        static $inject = ['AssignedEmployee'];

        constructor(AssignedEmployee: Ells.IAssignedEmployeeResource) {
            this.AssignedEmployee = AssignedEmployee;
        }

        add(jobId: number) {
            this.newAssignedEmployee = <Ells.IAssignedEmployee>{
                jobId: jobId,
                tasks: [{}]
            }
        }

        edit(assignedEmployee: Ells.IAssignedEmployee) {
            assignedEmployee.isEdit = true;
        }

        save(assignedEmployees: Ells.IAssignedEmployee[], assignedEmployee: Ells.IAssignedEmployee) {
            assignedEmployee.employeeId = assignedEmployee.employee.id;

            if (assignedEmployee.id) {
                this.AssignedEmployee.update(assignedEmployee);
                assignedEmployee.isEdit = false;
            } else {
                this.AssignedEmployee.save(assignedEmployee, (success) => {
                    assignedEmployee.id = success.id;
                    assignedEmployees.push(assignedEmployee);

                    this.newAssignedEmployee = null;
                });
            }
        }

        remove(assignedEmployees: Ells.IAssignedEmployee[], assignedEmployee: Ells.IAssignedEmployee) {
            this.AssignedEmployee.remove({}, assignedEmployee);
            _.remove(assignedEmployees, (item: Ells.IJob) => item.id == assignedEmployee.id);
        }

        cancel(assignedEmployee: Ells.IAssignedEmployee) {
            if (assignedEmployee.id) {
                assignedEmployee.isEdit = false;
            } else {
                this.newAssignedEmployee = null;
            }
        }

        addItem(items: any[]) {
            items.push({});
        }

        removeItem(items: any[], index: number) {
            items.splice(index, 1);
        }
    }
}

app.controller('clientDetailController', Ells.ClientDetailController);

app.controller('incomeEditController', Ells.IncomeEditController);
app.controller('jobEditController', Ells.JobEditController);
app.controller('assignedEmployeeEditController', Ells.AssignedEmployeeEditController);


interface JQuery {
    bootstrapToggle: any
}

interface IDeleteModalScope extends ng.IScope {
    ok: () => void
    cancel: () => void
}

app.controller('deleteModalController', function ($scope: IDeleteModalScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance) {

    $scope.ok = function () {
        $modalInstance.close(true);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});