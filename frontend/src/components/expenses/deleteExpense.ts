import {UrlUtils} from "../service/url-utils";
import {ExpensesService} from "../service/expenses-service";
import {OperationsService} from "../service/operations-service";
import {AllOperationsType} from "../../types/allOperations.type";
import {ApiEnum} from "../../types/api.enum";
import {ExpenseResponse, GetExpenseResponseType} from "../../types/get-expense-response.type";
import {OperationsReturnType} from "../../types/operations-return.type";
import {OperationResponseType} from "../../types/operation-response.type";
import {DeleteExpenseResponseType} from "../../types/delete-expense-response.type";

export class DeleteExpense {
    readonly openNewRoute: any;
    readonly idCategory: string | null;

    constructor(openNewRoute: any) {

        this.openNewRoute = openNewRoute;

        this.idCategory = UrlUtils.getUrlParam('id');
        if (!this.idCategory) {
            return this.openNewRoute('/');
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

        this.deleteExpenses().then();
    }

    private async deleteExpenses(): Promise<DeleteExpenseResponseType | ApiEnum | null> {
        const response: ApiEnum | DeleteExpenseResponseType = await ExpensesService.deleteExpense((this.idCategory as string));

        if ((response as DeleteExpenseResponseType).error) {
            return (response as DeleteExpenseResponseType).redirect ? this.openNewRoute((response as DeleteExpenseResponseType).redirect) : null;
        }

        return this.openNewRoute(ApiEnum.EXPENSES);
    }

    private async getCategory(): Promise<string> {
        const result: ApiEnum | GetExpenseResponseType = await ExpensesService.getExpense((this.idCategory as string));

        return ((result as GetExpenseResponseType).expense as ExpenseResponse).title;
    }

    private async getOperations(): Promise<OperationResponseType[]> {
        const response: OperationsReturnType | ApiEnum = await OperationsService.getOperationWithFilter('?period=all');

        const result: OperationResponseType[] | null = (response as OperationsReturnType).operations

        return (result as OperationResponseType[] ).filter((item: OperationResponseType) => item.type === 'expense');
    }

    private async deleteOperation(id: number[]): Promise<void> {
        for (const item of id) {
            const response: OperationsReturnType | ApiEnum = await OperationsService.deleteOperation(item);

            if ((response as OperationsReturnType).error) {
                (response as OperationsReturnType).redirect ? this.openNewRoute((response as OperationsReturnType).redirect) : null;
            }
        }
    }
}