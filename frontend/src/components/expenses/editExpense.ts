import {UrlUtils} from "../service/url-utils";
import {ExpensesService} from "../service/expenses-service";
import {ApiEnum} from "../../types/api.enum";
import {ExpenseResponse, GetExpenseResponseType} from "../../types/get-expense-response.type";

export class EditExpense {
    readonly openNewRoute: any;
    readonly inputNameElement: HTMLElement | null = null;
    readonly updateButtonElement: HTMLElement | null = null;
    private getIncomeResult: ExpenseResponse | null | undefined;
    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.inputNameElement = document.getElementById('inputTitle');
        this.updateButtonElement = document.getElementById('updateButton');

        this.getExpense(id).then();

        if (this.updateButtonElement) {
            this.updateButtonElement.addEventListener('click', this.updateExpense.bind(this))
        }
    }

    private async getExpense(id: string): Promise<void> {
        const result: ApiEnum | GetExpenseResponseType = await ExpensesService.getExpense(id);

        this.getIncomeResult = (result as GetExpenseResponseType).expense;

        if (this.inputNameElement) {
            (this.inputNameElement as HTMLInputElement).value = ((result as GetExpenseResponseType).expense as ExpenseResponse).title;
        }
    }

    private async updateExpense(e: { preventDefault: () => void; }): Promise<void> {
        e.preventDefault();

        await ExpensesService.updateExpense((this.getIncomeResult as ExpenseResponse).id, {
            title: (this.inputNameElement as HTMLInputElement).value,
        });

        this.openNewRoute(ApiEnum.EXPENSES);
    }
}