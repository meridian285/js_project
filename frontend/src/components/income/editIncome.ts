import {UrlUtils} from "../service/url-utils";
import {IncomeService} from "../service/income-service";
import {INCOME} from "../../../config/config";

export class EditIncome {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.inputNameElement = document.getElementById('inputTitle');
        this.updateButtonElement = document.getElementById('updateButton');

        this.getIncome(id).then();

        this.updateButtonElement.addEventListener('click', this.updateIncome.bind(this))
    }

    async getIncome(id) {
        const result = await IncomeService.getIncome(id);

        this.getIncomeResult = result.income
        this.inputNameElement.value = result.income.title;
    }

    async updateIncome(e){
        e.preventDefault();

        const result = await IncomeService.updateIncome(this.getIncomeResult.id, {
            title: this.inputNameElement.value,
        });

        this.openNewRoute(INCOME);
    }
}