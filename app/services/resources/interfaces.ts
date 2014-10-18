'use strict';

module Ells {
    export interface IEllsResource<T> extends ng.resource.IResourceClass<T> {
        update(data: T): T
    }

    export interface IEllsClass<T> extends ng.resource.IResource<T> {
        id: number;
    }

    export interface IEmployee extends IEllsClass<IEmployee> {
        name: string;
        email: string;
        phoneNumbers: any[];
        accountNumbers: any[];
    }

    export interface IClient extends IEllsClass<IClient> {
        name: string;
        email: string;
        phoneNumbers: any[];        
        incomes: any[];        
        totalFee: number;
        selectedPackage: string;
        packageItems: any[];

        //client Properties
        outstandingFee: number;
        isEdit: boolean;

        //child Objects
        jobs: Ells.IJob[];        
    }

    export interface IPackage extends IEllsClass<IPackage> {
        name: string
        items: any[]
    }

    export interface IIncome extends IEllsClass<IIncome> {
        clientId: number
        amount: number
        dateTime: Date
        paymentType: string
        note: string
    }

    export interface IJob extends IEllsClass<IJob> {
        clientId: number
        note: string
        location: string
        weddingDress: string
        eventStartDate: Date
        jobStartDate: Date
        assignedEmployees: IAssignedEmployee[]

        isEdit: boolean
    }

    export interface IAssignedEmployee extends IEllsClass<IAssignedEmployee> {
        employeeId: number
        jobId: number
        tasks: any[]
        fee: number
        isPaid: boolean
        employee: IEmployee

        isEdit: boolean
    }

    export interface IEmployeeResource extends IEllsResource<IEmployee> {
    }

    export interface IPackageResource extends IEllsResource<IPackage> {
    }

    export interface IClientResource extends IEllsResource<IClient> {
    }

    export interface IIncomeResource extends IEllsResource<IIncome> {
    }

    export interface IJobResource extends IEllsResource<IJob> {
    }

    export interface IAssignedEmployeeResource extends IEllsResource<IAssignedEmployee> {
    }
}