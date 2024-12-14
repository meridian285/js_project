import {IncomeService} from "../service/income-service";
import {UrlUtils} from "../service/url-utils";
import {INCOME} from "../../../config/config";
import {OperationsService} from "../service/operations-service";
import {ApiEnum} from "../../types/api.enum";
import {AllOperationsType} from "../../types/allOperations.type";

export class DeleteIncome {
    readonly openNewRoute: any;
    readonly idCategory: string | null;

    constructor(openNewRoute: any) {

        this.openNewRoute = openNewRoute;

        this.idCategory = UrlUtils.getUrlParam('id');
        if (!this.idCategory) {
            return this.openNewRoute(ApiEnum.DASHBOARD);
        }

        this.init().then();
    }

    private async init(): Promise<void> {
        const allOperations: AllOperationsType[] = await this.getOperations();

        const titleDeletedCategory = await this.getCategory();

        const idOperations: number[] = [];

        allOperations.forEach((item: AllOperationsType) => {
            if (String(item.category === String(titleDeletedCategory)) {
                idOperations.push(item.id);
            }
        });

        this.deleteOperation(idOperations).then();

        this.deleteIncome().then();
    }

    private async deleteIncome(): Promise<void> {
        const response = await IncomeService.deleteIncome(this.idCategory);

        if (response.error) {
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute(INCOME);
    }

    private async getCategory(): Promise<string> {
        const result = await IncomeService.getIncome(this.idCategory)

        return result.income.title;
    }

    private async getOperations() {
        const response = await OperationsService.getOperationWithFilter('?period=all');

        const result = response.operations

        return result.filter(item => item.type === 'income');
    }


    async deleteOperation(id: number[]) {
        id.forEach((item: number) => {
            const response = OperationsService.deleteOperation(item);

            if (response.error) {
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

        })
    }
}