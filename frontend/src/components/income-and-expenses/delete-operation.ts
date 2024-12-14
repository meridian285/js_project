import {UrlUtils} from "../service/url-utils";
import {OPERATIONS} from "../../../config/config";
import {OperationsService} from "../service/operations-service";

export class DeleteOperation {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteOperation(id).then();
    }

    async deleteOperation(id) {
        const response = await OperationsService.deleteOperation(id);

        if (response.error) {
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute(OPERATIONS);
    }
}