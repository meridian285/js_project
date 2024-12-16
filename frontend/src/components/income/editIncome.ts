import {UrlUtils} from "../service/url-utils";
import {IncomeService} from "../service/income-service";
import {INCOME} from "../../../config/config";
import {ApiEnum} from "../../types/api.enum";
import {GetIncomeResponseType, IncomeResponse} from "../../types/incomes/get-income-response.type";

export class EditIncome {
    readonly openNewRoute: any;
    readonly inputNameElement: HTMLElement | null = null;
    readonly updateButtonElement: HTMLElement | null = null;
    private getIncomeResult: IncomeResponse | null | undefined;
    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.inputNameElement = document.getElementById('inputTitle');
        this.updateButtonElement = document.getElementById('updateButton');

        this.getIncome(id).then();

        if (this.updateButtonElement) {
            this.updateButtonElement.addEventListener('click', this.updateIncome.bind(this));
        }
    }

    private async getIncome(id: string): Promise<void> {
        const result: ApiEnum | GetIncomeResponseType = await IncomeService.getIncome(id);

        this.getIncomeResult = (result as GetIncomeResponseType).income;
        if (this.inputNameElement) {
            (this.inputNameElement as HTMLInputElement).value = ((result as GetIncomeResponseType).income as IncomeResponse).title;
        }
    }

    private async updateIncome(e: { preventDefault: () => void; }): Promise<void> {
        e.preventDefault();

        await IncomeService.updateIncome((this.getIncomeResult as IncomeResponse).id, {
            title: (this.inputNameElement as HTMLInputElement).value,
        });

        this.openNewRoute(INCOME);
    }
}