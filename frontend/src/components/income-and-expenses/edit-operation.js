import {OperationsService} from "../service/operations-service";
import {UrlUtils} from "../service/url-utils";
import {IncomeService} from "../service/income-service";
import {ExpensesService} from "../service/expenses-service";
import {OPERATIONS} from "../../../config/config";

export class EditOperation {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.typeSelectElement = document.getElementById('type');
        this.categorySelectElement = document.getElementById('category');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('comment');
        this.saveButtonElement = document.getElementById('save-button');

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.typeSelectElement.addEventListener('change', () => {
            if (this.typeSelectElement.value === 'expense') {
                this.addCategoryList(this.getExpenses()).then();
            } else {
                this.addCategoryList(this.getIncomes()).then();
            }
        });

        this.getOperation(id).then();

        this.saveButtonElement.addEventListener('click', this.updateOperation.bind(this))
    }

    async updateOperation() {
        await OperationsService.updateOperation(this.getResult.id, {
            type: this.typeSelectElement.value,
            amount: Number(this.amountInputElement.value),
            date: this.dateInputElement.value,
            comment: this.commentInputElement.value,
            category_id: Number(this.categorySelectElement.value),
        });

        this.openNewRoute(OPERATIONS);
    }

    async getOperation(id) {
        const result = await OperationsService.getOperation(id);
        this.getResult = result.operation;
        this.showOperation(result.operation);
    }

    showOperation(operation) {
        this.typeSelectElement.value = operation.type;

        if (this.typeSelectElement.value === 'expense') {
            this.addCategoryList(this.getExpenses(), operation);
        } else {
            this.addCategoryList(this.getIncomes(), operation);
        }

        this.amountInputElement.value = operation.amount;
        this.dateInputElement.value = operation.date;
        this.commentInputElement.value = operation.comment;
    }

    async getIncomes() {
        const result = await IncomeService.getIncomes();
        // this.deleteOptions();

        return result.incomes
    }

    async getExpenses() {
        const result = await ExpensesService.getExpenses();
        // this.deleteOptions();

        return result.expenses
    }

    async addCategoryList(category, operation = null) {
        const result = await category;
        this.deleteOptions();

        // if (operation === null){
        //     result.forEach(item => {
        //         const option = document.createElement('option');
        //         option.setAttribute('value', item.id)
        //         option.innerText = item.title;
        //         this.categorySelectElement.appendChild(option);
        //     });
        // } else {
            result.forEach(item => {
                const option = document.createElement('option');
                option.setAttribute('value', item.id)
                option.innerText = item.title;
                if (operation !== null && item.title === operation.category) {
                        option.selected = true;
                }
                this.categorySelectElement.appendChild(option);
            });
        // }
    }

    deleteOptions() {
        const optionList = this.categorySelectElement.querySelectorAll('option');
        optionList.forEach(item => item.remove());
    }
}