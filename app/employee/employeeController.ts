/// <reference path="../../scripts/typings/lodash/lodash.d.ts" />
'use strict';

module Ells {

    export class EmployeeController {
        private $scope: ng.IScope
        private Employee: Ells.IEmployeeResource

        title: string
        employees: Ells.IEmployee[]
        employeeEdit: Ells.IEmployee

        static $inject = ['$scope', 'Employee'];

        constructor($scope, Employee: Ells.IEmployeeResource) {
            this.$scope = $scope;
            this.Employee = Employee;

            this.title = "Employee";
            Employee.query((data) => {
                this.employees = data.value;
            });
        }

        addItem(items: any[]) {
            items.push({
                
            });
        }

        removeItem(items: any[], index: number) {
            items.splice(index, 1);
        }

        editEmployee(employee: Ells.IEmployee) {
            if (employee) {
                this.employeeEdit = employee;
            } else {
                this.employeeEdit = <Ells.IEmployee>{
                    phoneNumbers: [{}],
                    accountNumbers:[{}]
                }
            }
        }

        cancelEditEmployee() {
            this.employeeEdit = null;
        }

        save() {
            if (this.employeeEdit.id) {
                this.Employee.update(this.employeeEdit);
                this.employeeEdit = null;
            } else {
                this.Employee.save(this.employeeEdit, () => {
                    var newEmployee = _.cloneDeep(this.employeeEdit);
                    this.employees.push(newEmployee);

                    this.employeeEdit = null;
                });
            }            
        }


    }
}

app.controller('employeeController', Ells.EmployeeController);

//app.controller('employeeController', ['$scope', 'Employee', function ($scope, Employee : Ells.IEmployeeResource) {        
//    var employee = Employee.get({ id: 1 }, (test) => {

//        console.log(employee.name);
//    });

//}]); 

