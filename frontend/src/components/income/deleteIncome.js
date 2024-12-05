import {IncomeService} from "../service/income-service";
import {UrlUtils} from "../service/url-utils";
import {INCOME} from "../../../config/config";
import {OperationsService} from "../service/operations-service";

export class DeleteIncome {
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

        this.deleteIncome().then();
    }

    async deleteIncome() {
        const response = await IncomeService.deleteIncome(this.idCategory);

        if (response.error) {
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute(INCOME);
    }

    async getCategory() {
        const result = await IncomeService.getIncome(this.idCategory)

        return result.income.title;
    }

    async getOperations() {
        const response = await OperationsService.getOperationWithFilter('?period=all');

        const result = response.operations

        return result.filter(item => item.type === 'income');
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