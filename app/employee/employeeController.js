/// <reference path="../../scripts/typings/lodash/lodash.d.ts" />
'use strict';
var Ells;
(function (Ells) {
    var EmployeeController = (function () {
        function EmployeeController($scope, Employee) {
            var _this = this;
            this.$scope = $scope;
            this.Employee = Employee;

            this.title = "Employee";
            Employee.query(function (data) {
                _this.employees = data.value;
            });
        }
        EmployeeController.prototype.addItem = function (items) {
            items.push({});
        };

        EmployeeController.prototype.removeItem = function (items, index) {
            items.splice(index, 1);
        };

        EmployeeController.prototype.editEmployee = function (employee) {
            if (employee) {
                this.employeeEdit = employee;
            } else {
                this.employeeEdit = {
                    phoneNumbers: [{}],
                    accountNumbers: [{}]
                };
            }
        };

        EmployeeController.prototype.cancelEditEmployee = function () {
            this.employeeEdit = null;
        };

        EmployeeController.prototype.save = function () {
            var _this = this;
            if (this.employeeEdit.id) {
                this.Employee.update(this.employeeEdit);
                this.employeeEdit = null;
            } else {
                this.Employee.save(this.employeeEdit, function () {
                    var newEmployee = _.cloneDeep(_this.employeeEdit);
                    _this.employees.push(newEmployee);

                    _this.employeeEdit = null;
                });
            }
        };
        EmployeeController.$inject = ['$scope', 'Employee'];
        return EmployeeController;
    })();
    Ells.EmployeeController = EmployeeController;
})(Ells || (Ells = {}));

app.controller('employeeController', Ells.EmployeeController);
//app.controller('employeeController', ['$scope', 'Employee', function ($scope, Employee : Ells.IEmployeeResource) {
//    var employee = Employee.get({ id: 1 }, (test) => {
//        console.log(employee.name);
//    });
//}]);
//# sourceMappingURL=employeeController.js.map
