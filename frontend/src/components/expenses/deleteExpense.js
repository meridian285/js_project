import {UrlUtils} from "../service/url-utils";
import {EXPENSES} from "../../../config/config";
import {ExpensesService} from "../service/expenses-service";
import {IncomeService} from "../service/income-service";
import {OperationsService} from "../service/operations-service";

export class DeleteExpense {
    constructor(openNewRoute) {

        this.openNewRoute = openNewRoute;

        this.idCategory = UrlUtils.getUrlParam('id');
        if (!this.idCategory) {
            return this.openNewRoute('/');
        }

        this.init().then();
    }

    async init() {
        const allOperations = await this.getOperations();

        const titleDeletedCategory = await this.getCategory();

        const idOperations = [];

        allOperations.forEach(item => {
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

    async getCategory() {
        const result = await ExpensesService.getExpense(this.idCategory)

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