/// <reference path="../../scripts/typings/lodash/lodash.d.ts" />
'use strict';

module Ells {

    export class ClientController {
        private $location: ng.ILocationService
        private $modal: ng.ui.bootstrap.IModalService
        private Client: Ells.IClientResource

        clients: Ells.IClient[]

        static $inject = ['$location', '$modal', 'Client'];

        constructor($location: ng.ILocationService, $modal: ng.ui.bootstrap.IModalService, Client: Ells.IClientResource) {
            this.$location = $location;
            this.$modal = $modal;
            this.Client = Client;

            Client.query({ '$expand': 'incomes' }, (data) => {
                this.clients = data.value;

                this.clients.forEach((item, index) => {
                    var incomesAmount = _.map(item.incomes, income => income.amount);

                    var amountPaid = _.reduce<any, number>(incomesAmount, (sum, num) => sum + num) || 0;

                    item.outstandingFee = item.totalFee - amountPaid;
                });
            });
        }

        add() {
            var modalInstance = this.$modal.open({
                templateUrl: 'addClientModal.html',
                controller: 'addClientModalController as vm'
            });

            modalInstance.result.then((newClient: Ells.IClient) => {
                if (newClient && newClient.name) {
                    this.Client.save({}, newClient, (client: Ells.IClient) => {
                        this.$location.path('/client/detail/' + client.id);
                    });
                }
            }, reason => {
                });
        }
    }
}

app.controller('clientController', Ells.ClientController);

app.controller('addClientModalController',['$modalInstance', function ($modalInstance: ng.ui.bootstrap.IModalServiceInstance) {
    var vm = this;

    vm.client = {
        phoneNumbers: [{}]
    };

    vm.save = () => {
        $modalInstance.close(this.client);
    };

    vm.cancel = () => {
        $modalInstance.dismiss('cancel');
    };

    vm.addItem = (items: any[]) => {
        items.push({});
    };

    vm.removeItem = (items: any[], index: number) => {
        items.splice(index, 1);
    };
}]);