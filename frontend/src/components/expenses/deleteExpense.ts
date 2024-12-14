import {UrlUtils} from "../service/url-utils";
import {EXPENSES} from "../../../config/config";
import {ExpensesService} from "../service/expenses-service";
import {IncomeService} from "../service/income-service";
import {OperationsService} from "../service/operations-service";
import {AllOperationsType} from "../../types/allOperations.type";
import {ApiEnum} from "../../types/api.enum";
import {ExpenseResponseType} from "../../types/expense-response.type";

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

        const titleDeletedCategory = await this.getCategory();

        const idOperations: number[] = [];

        allOperations.forEach((item: AllOperationsType) => {
            if (String(item.category) === String(titleDeletedCategory)) {
                idOperations.push(item.id);
            }
        });

        this.deleteOperation(idOperations).then();

        this.deleteExpenses().then();
    }

    async deleteExpenses() {
        const response = await ExpensesService.deleteExpense(this.idCategory);

        if (response.error) {
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute(EXPENSES);
    }

    private async getCategory(): Promise<string> {
        let result: ApiEnum | ExpenseResponseType;
        if (this.idCategory) {
            result = await ExpensesService.getExpense(this.idCategory)
        }

        return result.expense.title;
    }

    async getOperations() {
        const response = await OperationsService.getOperationWithFilter('?period=all');

        const result = response.operations

        return result.filter(item => item.type === 'expense');
    }

    async deleteOperation(id) {
        id.forEach(item => {
            const response = OperationsService.deleteOperation(item);

            if (response.error) {
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

        })
    }
}