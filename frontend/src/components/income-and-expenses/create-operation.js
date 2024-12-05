import {IncomeService} from "../service/income-service";
import {ExpensesService} from "../service/expenses-service";
import {OperationsService} from "../service/operations-service";
import {OPERATIONS} from "../../../config/config";
import {UrlUtils} from "../service/url-utils";

export class CreateOperation {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const type = UrlUtils.getUrlParam('type');

        this.typeSelectElement = document.getElementById('type');
        this.categorySelectElement = document.getElementById('category');
        this.saveButtonElement = document.getElementById('save-button');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('start-date');
        this.commentInputElement = document.getElementById('comment');

        this.typeSelectElement.value = type;

        if (this.typeSelectElement.value === 'expense') {
            this.getExpenses().then();
        } else {
            this.getIncomes().then();
        }

        this.typeSelectElement.addEventListener('change', () => {
            if (this.typeSelectElement.value === 'expense') {
                this.getExpenses().then();
            } else {
                this.getIncomes().then();
            }
        });

        this.saveButtonElement.addEventListener('click', this.setCategory.bind(this));
    }

    async setCategory() {
        await OperationsService.createOperation({
            type: this.typeSelectElement.value,
            amount: Number(this.amountInputElement.value),
            date: this.dateInputElement.value,
            comment: this.commentInputElement.value,
            category_id: Number(this.categorySelectElement.value),
        });

        this.openNewRoute(OPERATIONS);
    }

    async getIncomes() {
        const result = await IncomeService.getIncomes();
        this.deleteOptions();
        this.addCategoryList(result.incomes)
    }

    async getExpenses() {
        const result = await ExpensesService.getExpenses();
        this.deleteOptions();
        this.addCategoryList(result.expenses);
    }

    addCategoryList(category) {
        category.forEach(item => {
            const option = document.createElement('option');
            option.setAttribute('value', item.id)
            option.innerText = item.title;
            this.categorySelectElement.appendChild(option);
        });
    }

    deleteOptions() {
        const optionList = this.categorySelectElement.querySelectorAll('option');
        optionList.forEach(item => item.remove());
    }
}