import {IncomeService} from "../service/income-service";
import {UrlUtils} from "../service/url-utils";
import {OperationsService} from "../service/operations-service";
import {ApiEnum} from "../../types/api.enum";
import {AllOperationsType} from "../../types/allOperations.type";
import {DeleteExpenseResponseType} from "../../types/delete-expense-response.type";
import {DeleteIncomeResponseType} from "../../types/incomes/delete-income-response.type";
import {GetIncomeResponseType, IncomeResponse} from "../../types/incomes/get-income-response.type";
import {OperationResponseType} from "../../types/operation-response.type";
import {OperationsReturnType} from "../../types/operations-return.type";

export class DeleteIncome {
    readonly openNewRoute: any;
    readonly idCategory: string | null;

    constructor(openNewRoute: any) {

        this.openNewRoute = openNewRoute;

        this.idCategory = UrlUtils.getUrlParam('id');
        if (!this.idCategory) {
            return this.openNewRoute(ApiEnum.DASHBOARD);
        }

        this.init().then();
    }

    private async init(): Promise<void> {
        const allOperations: AllOperationsType[] = await this.getOperations();

        const titleDeletedCategory: string = await this.getCategory();

        const idOperations: number[] = [];

        allOperations.forEach((item: AllOperationsType) => {
            if (String(item.category) === String(titleDeletedCategory)) {
                idOperations.push(item.id);
            }
        });

        this.deleteOperation(idOperations).then();

        this.deleteIncome().then();
    }

    private async deleteIncome(): Promise<ApiEnum | DeleteExpenseResponseType> {
        const response: ApiEnum | DeleteIncomeResponseType = await IncomeService.deleteIncome((this.idCategory as string));

        if ((response as DeleteIncomeResponseType).error) {
            return (response as DeleteIncomeResponseType).redirect ? this.openNewRoute((response as DeleteIncomeResponseType).redirect) : null;
        }

        return this.openNewRoute(ApiEnum.INCOME);
    }

    private async getCategory(): Promise<string> {
        const result: ApiEnum | GetIncomeResponseType = await IncomeService.getIncome((this.idCategory as string));

        return ((result as GetIncomeResponseType).income as IncomeResponse).title;
    }

    private async getOperations(): Promise<OperationResponseType[]> {
        const response: ApiEnum | OperationsReturnType = await OperationsService.getOperationWithFilter('?period=all');

        const result = (response as OperationsReturnType).operations

        return (result as OperationResponseType[]).filter((item: OperationResponseType) => item.type === 'income');
    }


    public async deleteOperation(id: number[]): Promise<void> {
        for (const item of id) {
            const response: OperationsReturnType | ApiEnum = await OperationsService.deleteOperation(String(item));

            if ((response as OperationsReturnType).error) {
                (response as OperationsReturnType).redirect ? this.openNewRoute((response as OperationsReturnType).redirect) : null;
            }

        }
    }
}