/// <reference path="../../scripts/typings/lodash/lodash.d.ts" />
/// <reference path="../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
'use strict';
var Ells;
(function (Ells) {
    var ClientDetailController = (function () {
        function ClientDetailController($location, $modal, $routeParams, $q, $scope, Client, Employee, Package) {
            this.Client = Client;
            this.$location = $location;
            this.$modal = $modal;

            var id = $routeParams["id"];

            var clientQ = Client.get({ 'id': id, '$expand': 'incomes,jobs($expand=assignedEmployees)' });
            var employeeQ = Employee.query();
            var packageQ = Package.query();

            var vm = this;

            $q.all([clientQ.$promise, employeeQ.$promise, packageQ.$promise]).then(function (result) {
                vm.employees = result[1].value;
                vm.packages = result[2].value;

                var client = result[0];

                client.jobs.forEach(function (job) {
                    job.assignedEmployees.forEach(function (assignedEmplyee) {
                        assignedEmplyee.employee = _.find(vm.employees, function (ee) {
                            return ee.id == assignedEmplyee.employeeId;
                        });
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
        ClientDetailController.prototype.editPackage = function () {
            this.packageEdit = {
                selectedPackage: this.client.selectedPackage,
                packageItems: _.cloneDeep(this.client.packageItems)
            };
        };

        ClientDetailController.prototype.changePackage = function () {
            var _this = this;
            var pckg = _.find(this.packages, function (item) {
                return item.name == _this.packageEdit.selectedPackage;
            });
            this.packageEdit.packageItems = _.cloneDeep(pckg.items);
        };

        ClientDetailController.prototype.cancelPackageEdit = function () {
            this.packageEdit = null;
        };

        ClientDetailController.prototype.updatePackage = function () {
            this.client.selectedPackage = this.packageEdit.selectedPackage;
            this.client.packageItems = _.cloneDeep(this.packageEdit.packageItems);

            this.update();
        };

        ClientDetailController.prototype.addItem = function (items) {
            items.push({});
        };

        ClientDetailController.prototype.removeItem = function (items, index) {
            items.splice(index, 1);
        };

        ClientDetailController.prototype.edit = function () {
            this.client.isEdit = true;
        };

        ClientDetailController.prototype.cancel = function () {
            this.client.isEdit = false;
        };

        ClientDetailController.prototype.update = function () {
            this.Client.update(this.client);
            this.client.isEdit = false;
            this.packageEdit = false;
        };

        ClientDetailController.prototype.remove = function () {
            var _this = this;
            var modalInstance = this.$modal.open({
                templateUrl: 'deleteClientModal.html',
                controller: 'deleteModalController'
            });

            modalInstance.result.then(function (status) {
                if (status) {
                    _this.Client.remove({}, _this.client, function () {
                        _this.$location.path('/client');
                    });
                }
            }, function (reason) {
            });
        };
        ClientDetailController.$inject = ['$location', '$modal', '$routeParams', '$q', '$scope', 'Client', 'Employee', 'Package'];
        return ClientDetailController;
    })();
    Ells.ClientDetailController = ClientDetailController;

    var IncomeEditController = (function () {
        function IncomeEditController(Income) {
            this.Income = Income;
        }
        IncomeEditController.prototype.openDp = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            this.isDpOpened = true;
        };

        IncomeEditController.prototype.edit = function (clientId, income) {
            if (income) {
                this.incomeEdit = income;
            } else {
                this.incomeEdit = {
                    paymentType: 'Cash',
                    clientId: clientId
                };
            }
        };

        IncomeEditController.prototype.save = function (incomes) {
            var _this = this;
            if (this.incomeEdit.id) {
                this.Income.update(this.incomeEdit);
                this.incomeEdit = null;
            } else {
                this.Income.save(this.incomeEdit, function () {
                    var newIncome = _.cloneDeep(_this.incomeEdit);
                    incomes.push(newIncome);

                    _this.incomeEdit = null;
                });
            }
        };

        IncomeEditController.prototype.cancel = function () {
            this.incomeEdit = null;
        };
        IncomeEditController.$inject = ['Income'];
        return IncomeEditController;
    })();
    Ells.IncomeEditController = IncomeEditController;

    var JobEditController = (function () {
        function JobEditController(Job) {
            this.Job = Job;
        }
        JobEditController.prototype.openDp = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            this.isDpOpened = true;
        };

        JobEditController.prototype.add = function (clientId) {
            this.newJob = {
                clientId: clientId
            };
        };

        JobEditController.prototype.edit = function (job) {
            job.isEdit = true;
        };

        JobEditController.prototype.save = function (jobs, job) {
            var _this = this;
            if (job.id) {
                this.Job.update(job);
                job.isEdit = false;
            } else {
                this.Job.save(job, function (success) {
                    job.id = success.id;
                    jobs.push(job);

                    _this.newJob = null;
                });
            }
        };

        JobEditController.prototype.remove = function (jobs, job) {
            this.Job.remove({}, job);
            _.remove(jobs, function (item) {
                return item.id == job.id;
            });
        };

        JobEditController.prototype.cancel = function (job) {
            if (job.id) {
                job.isEdit = false;
            } else {
                this.newJob = null;
            }
        };
        JobEditController.$inject = ['Job'];
        return JobEditController;
    })();
    Ells.JobEditController = JobEditController;

    var AssignedEmployeeEditController = (function () {
        function AssignedEmployeeEditController(AssignedEmployee) {
            this.AssignedEmployee = AssignedEmployee;
        }
        AssignedEmployeeEditController.prototype.add = function (jobId) {
            this.newAssignedEmployee = {
                jobId: jobId,
                tasks: [{}]
            };
        };

        AssignedEmployeeEditController.prototype.edit = function (assignedEmployee) {
            assignedEmployee.isEdit = true;
        };

        AssignedEmployeeEditController.prototype.save = function (assignedEmployees, assignedEmployee) {
            var _this = this;
            assignedEmployee.employeeId = assignedEmployee.employee.id;

            if (assignedEmployee.id) {
                this.AssignedEmployee.update(assignedEmployee);
                assignedEmployee.isEdit = false;
            } else {
                this.AssignedEmployee.save(assignedEmployee, function (success) {
                    assignedEmployee.id = success.id;
                    assignedEmployees.push(assignedEmployee);

                    _this.newAssignedEmployee = null;
                });
            }
        };

        AssignedEmployeeEditController.prototype.remove = function (assignedEmployees, assignedEmployee) {
            this.AssignedEmployee.remove({}, assignedEmployee);
            _.remove(assignedEmployees, function (item) {
                return item.id == assignedEmployee.id;
            });
        };

        AssignedEmployeeEditController.prototype.cancel = function (assignedEmployee) {
            if (assignedEmployee.id) {
                assignedEmployee.isEdit = false;
            } else {
                this.newAssignedEmployee = null;
            }
        };

        AssignedEmployeeEditController.prototype.addItem = function (items) {
            items.push({});
        };

        AssignedEmployeeEditController.prototype.removeItem = function (items, index) {
            items.splice(index, 1);
        };
        AssignedEmployeeEditController.$inject = ['AssignedEmployee'];
        return AssignedEmployeeEditController;
    })();
    Ells.AssignedEmployeeEditController = AssignedEmployeeEditController;
})(Ells || (Ells = {}));

app.controller('clientDetailController', Ells.ClientDetailController);

app.controller('incomeEditController', Ells.IncomeEditController);
app.controller('jobEditController', Ells.JobEditController);
app.controller('assignedEmployeeEditController', Ells.AssignedEmployeeEditController);

app.controller('deleteModalController', function ($scope, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close(true);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
//# sourceMappingURL=clientDetailController.js.map
