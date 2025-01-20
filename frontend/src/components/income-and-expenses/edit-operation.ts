import {OperationsService} from "../service/operations-service";
import {UrlUtils} from "../service/url-utils";
import {IncomeService} from "../service/income-service";
import {ExpensesService} from "../service/expenses-service";
import {OperationResponseType} from "../../types/operation-response.type";
import {ApiEnum} from "../../types/api.enum";
import {OperationReturnType} from "../../types/operation-return.type";
import {ExpensesResponse, GetExpensesResponseType} from "../../types/get-expenses-response.type";
import {GetIncomesResponseType, IncomesResponse} from "../../types/incomes/get-incomes-response.type";
import {ExpenseResponse} from "../../types/get-expense-response.type";

export class EditOperation {
    readonly openNewRoute: any;
    readonly typeSelectElement: HTMLElement | null;
    readonly categorySelectElement: HTMLElement | null = null;
    private amountInputElement: HTMLElement | null;
    private dateInputElement: HTMLElement | null;
    private commentInputElement: HTMLElement | null;
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

        this.openNewRoute(ApiEnum.OPERATIONS);
    }

    private async getOperation(id: string): Promise<void> {
        const result: OperationReturnType | ApiEnum = await OperationsService.getOperation(id);
        this.getResult = (result as OperationReturnType).operation;
        this.showOperation(((result as OperationReturnType).operation as OperationResponseType));
    }

    private showOperation(operation: OperationResponseType): void {
        if (this.typeSelectElement) {
            (this.typeSelectElement as HTMLSelectElement).value = operation.type;
        }

        if ((this.typeSelectElement as HTMLSelectElement).value === 'expense') {
            this.addCategoryList(this.getExpenses(), operation);
        } else {
            this.addCategoryList(this.getIncomes(), operation);
        }

        (this.amountInputElement as HTMLInputElement).value = String(operation.amount);
        (this.dateInputElement as HTMLInputElement).value = operation.date;
        (this.commentInputElement as HTMLInputElement).value = operation.comment;
    }

    async getIncomes(): Promise<IncomesResponse[] | null> {
        const result: GetIncomesResponseType | ApiEnum = await IncomeService.getIncomes();

        return (result as GetIncomesResponseType).incomes
    }

    async getExpenses(): Promise<ExpensesResponse[] | null> {
        const result: GetExpensesResponseType | ApiEnum = await ExpensesService.getExpenses();

        return (result as GetExpensesResponseType).expenses
    }

    async addCategoryList(category: Promise<ExpensesResponse[] | null>, operation: OperationResponseType | null = null): Promise<void> {
        const result: ExpenseResponse[] | null = await category;
        this.deleteOptions();

        (result as ExpenseResponse[]).forEach((item: ExpenseResponse) => {
            const option: HTMLOptionElement = document.createElement('option');
            option.setAttribute('value', String(item.id))
            option.innerText = item.title;
            if (operation !== null && item.title === operation.category) {
                option.selected = true;
            }
            if (this.categorySelectElement) {
                this.categorySelectElement.appendChild(option);
            }
        });
        // }
    }

    deleteOptions() {
        const optionList: NodeListOf<HTMLOptionElement> = (this.categorySelectElement as HTMLSelectElement).querySelectorAll('option');
        optionList.forEach((item: HTMLOptionElement) => item.remove());
    }
}