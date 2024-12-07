import {UrlUtils} from "../service/url-utils";
import {ExpensesService} from "../service/expenses-service";
import {EXPENSES, INCOME} from "../../../config/config";

export class EditExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.inputNameElement = document.getElementById('inputTitle');
        this.updateButtonElement = document.getElementById('updateButton');

        this.getExpense(id).then();

        this.updateButtonElement.addEventListener('click', this.updateExpense.bind(this))
    }

    async getExpense(id) {
        const result = await ExpensesService.getExpense(id);

        this.getIncomeResult = result.expense
        this.inputNameElement.value = result.expense.title;
    }

    async updateExpense(e) {
        e.preventDefault();

        const result = await ExpensesService.updateExpense(this.getIncomeResult.id, {
            title: this.inputNameElement.value,
        });

        this.openNewRoute(EXPENSES);
    }
}