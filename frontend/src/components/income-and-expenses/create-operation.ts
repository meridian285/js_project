import {IncomeService} from "../service/income-service";
import {ExpensesService} from "../service/expenses-service";
import {OperationsService} from "../service/operations-service";
import {OPERATIONS} from "../../../config/config";
import {UrlUtils} from "../service/url-utils";
import {ApiEnum} from "../../types/api.enum";
import {GetIncomesResponseType} from "../../types/incomes/get-incomes-response.type";
import {ExpensesResponse, GetExpensesResponseType} from "../../types/get-expenses-response.type";

export class CreateOperation {
    readonly openNewRoute: any;
    readonly typeSelectElement: HTMLElement | null;
    private categorySelectElement: HTMLElement | null;
    private saveButtonElement: HTMLElement | null;
    private amountInputElement: HTMLElement | null;
    private dateInputElement: HTMLElement | null;
    private commentInputElement: HTMLElement | null;

    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        const type: string | null = UrlUtils.getUrlParam('type');

        this.typeSelectElement = document.getElementById('type');
        this.categorySelectElement = document.getElementById('category');
        this.saveButtonElement = document.getElementById('save-button');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('start-date');
        this.commentInputElement = document.getElementById('comment');

        if (this.typeSelectElement) {
            if (typeof type === "string") {
                (this.typeSelectElement as HTMLSelectElement).value = type;
            }

            if ((this.typeSelectElement as HTMLSelectElement).value === 'expense') {
                this.getExpenses().then();
            } else {
                this.getIncomes().then();
            }

            this.typeSelectElement.addEventListener('change', () => {
                if ((this.typeSelectElement as HTMLSelectElement).value === 'expense') {
                    this.getExpenses().then();
                } else {
                    this.getIncomes().then();
                }
            });
        }


        if (this.saveButtonElement) {
            this.saveButtonElement.addEventListener('click', this.setCategory.bind(this));
        }
    }

    private async setCategory(): Promise<void> {
        await OperationsService.createOperation({
            type: (this.typeSelectElement as HTMLSelectElement).value,
            amount: Number((this.amountInputElement as HTMLInputElement).value),
            date: (this.dateInputElement as HTMLInputElement).value,
            comment: (this.commentInputElement as HTMLInputElement).value,
            category_id: Number((this.categorySelectElement as HTMLSelectElement).value),
        });

        this.openNewRoute(ApiEnum.OPERATIONS);
    }

    private async getIncomes(): Promise<void> {
        const result: GetIncomesResponseType | ApiEnum = await IncomeService.getIncomes();
        this.deleteOptions();
        this.addCategoryList(((result as GetIncomesResponseType).incomes as ExpensesResponse[]))
    }

    private async getExpenses(): Promise<void> {
        const result:GetExpensesResponseType | ApiEnum = await ExpensesService.getExpenses();
        this.deleteOptions();
        this.addCategoryList(((result as GetExpensesResponseType).expenses as ExpensesResponse[]));
    }

    addCategoryList(category: ExpensesResponse[]): void {
        category.forEach((item: ExpensesResponse) => {
            const option: HTMLOptionElement = document.createElement('option');
            option.setAttribute('value', String(item.id))
            option.innerText = item.title;
            if (this.categorySelectElement) {
                this.categorySelectElement.appendChild(option);
            }
        });
    }

    private deleteOptions(): void {
        if (this.categorySelectElement) {
            const optionList: NodeListOf<HTMLOptionElement> = this.categorySelectElement.querySelectorAll('option');
            optionList.forEach((item: HTMLOptionElement) => item.remove());
        }
    }
}