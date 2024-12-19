import {UrlUtils} from "../service/url-utils";
import {OperationsService} from "../service/operations-service";
import {ApiEnum} from "../../types/api.enum";
import {OperationsReturnType} from "../../types/operations-return.type";

export class DeleteOperation {
    readonly openNewRoute: any;
    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute(ApiEnum.DASHBOARD);
        }

        this.deleteOperation(id).then();
    }

    private async deleteOperation(id: string): Promise<void | ApiEnum | null> {
        const response: OperationsReturnType | ApiEnum = await OperationsService.deleteOperation(id);

        if (((response as OperationsReturnType).error as boolean)) {
            return (response as OperationsReturnType).redirect ? this.openNewRoute((response as OperationsReturnType).redirect) : null;
        }

        return this.openNewRoute(ApiEnum.OPERATIONS);
    }
}