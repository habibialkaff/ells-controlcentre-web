/// <reference path="../../scripts/typings/lodash/lodash.d.ts" />
'use strict';
var Ells;
(function (Ells) {
    var ClientController = (function () {
        function ClientController($location, $modal, Client) {
            var _this = this;
            this.$location = $location;
            this.$modal = $modal;
            this.Client = Client;

            Client.query({ '$expand': 'incomes' }, function (data) {
                _this.clients = data.value;

                _this.clients.forEach(function (item, index) {
                    var incomesAmount = _.map(item.incomes, function (income) {
                        return income.amount;
                    });

                    var amountPaid = _.reduce(incomesAmount, function (sum, num) {
                        return sum + num;
                    }) || 0;

                    item.outstandingFee = item.totalFee - amountPaid;
                });
            });
        }
        ClientController.prototype.add = function () {
            var _this = this;
            var modalInstance = this.$modal.open({
                templateUrl: 'addClientModal.html',
                controller: 'addClientModalController as vm'
            });

            modalInstance.result.then(function (newClient) {
                if (newClient && newClient.name) {
                    _this.Client.save({}, newClient, function (client) {
                        _this.$location.path('/client/detail/' + client.id);
                    });
                }
            }, function (reason) {
            });
        };
        ClientController.$inject = ['$location', '$modal', 'Client'];
        return ClientController;
    })();
    Ells.ClientController = ClientController;
})(Ells || (Ells = {}));

app.controller('clientController', Ells.ClientController);

app.controller('addClientModalController', [
    '$modalInstance', function ($modalInstance) {
        var _this = this;
        var vm = this;

        vm.client = {
            phoneNumbers: [{}]
        };

        vm.save = function () {
            $modalInstance.close(_this.client);
        };

        vm.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        vm.addItem = function (items) {
            items.push({});
        };

        vm.removeItem = function (items, index) {
            items.splice(index, 1);
        };
    }]);
//# sourceMappingURL=clientController.js.map
