import {OperationsService} from "../service/operations-service";
import {UrlUtils} from "../service/url-utils";
import {IncomeService} from "../service/income-service";
import {ExpensesService} from "../service/expenses-service";
import {OPERATIONS} from "../../../config/config";
import {OperationsReturnType} from "../../types/operations-return.type";
import {OperationResponseType} from "../../types/operation-response.type";
import {ApiEnum} from "../../types/api.enum";

export class EditOperation {
    readonly openNewRoute: any;
    readonly typeSelectElement: HTMLSelectElement | null;
    private categorySelectElement: HTMLSelectElement | null = null;
    private amountInputElement: HTMLInputElement | null = null;
    private dateInputElement: HTMLInputElement | null = null;
    private commentInputElement: HTMLInputElement | null;
    readonly saveButtonElement: HTMLElement | null;
    private getResult: OperationResponseType | undefined | null;
    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        this.typeSelectElement = document.getElementById('type');
        this.categorySelectElement = document.getElementById('category');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('comment');
        this.saveButtonElement = document.getElementById('save-button');

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute(ApiEnum.DASHBOARD);
        }

        if (this.typeSelectElement) {
            this.typeSelectElement.addEventListener('change', () => {
                if ((this.typeSelectElement as HTMLSelectElement).value === 'expense') {
                    this.addCategoryList(this.getExpenses()).then();
                } else {
                    this.addCategoryList(this.getIncomes()).then();
                }
            });
        }


        this.getOperation(id).then();

        if (this.saveButtonElement) {
            this.saveButtonElement.addEventListener('click', this.updateOperation.bind(this))
        }
    }

    private async updateOperation(): Promise<void> {
        await OperationsService.updateOperation((this.getResult as OperationResponseType).id, {
            type: (this.typeSelectElement as HTMLSelectElement).value,
            amount: Number((this.amountInputElement as HTMLInputElement).value),
            date: (this.dateInputElement as HTMLInputElement).value,
            comment: (this.commentInputElement as HTMLInputElement).value,
            category_id: Number((this.categorySelectElement as HTMLSelectElement).value),
        });

        this.openNewRoute(OPERATIONS);
    }

    private async getOperation(id: string): Promise<void> {
        const result: OperationsReturnType = await OperationsService.getOperation(id);
        this.getResult = result.operations;
        this.showOperation(result.operations);
    }

    private showOperation(operation): void {
        if (this.typeSelectElement) {
            this.typeSelectElement.value = operation.type;
        }

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

        return result.incomes
    }

    async getExpenses() {
        const result = await ExpensesService.getExpenses();

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