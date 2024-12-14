import {HttpUtils} from "../../utils/http-utils";
import {
    DELETE,
    OPERATIONS,
    POST,
    PUT
} from "../../../config/config";
import {OperationsReturnType} from "../../types/operations-return.type";
import {ApiEnum} from "../../types/api.enum";
import {MethodEnum} from "../../types/method-enum";
import {OperationUpdateDataType} from "../../types/operation-update-data.type";

export class OperationsService {

    public static async getOperation(id: string): Promise<OperationsReturnType> {
        const returnObject: OperationsReturnType = {
            error: false,
            redirect: null,
            operations : null,
        };

        const result = await HttpUtils.request(OPERATIONS + ApiEnum.DASHBOARD + id);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при запросе операции';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.operations = result.response;
        return returnObject;
    }

    public static async getOperationWithFilter(dateInterval: string): Promise<OperationsReturnType> {
        const returnObject: OperationsReturnType = {
            error: false,
            redirect: null,
            operations: null,
        };

        const result = await HttpUtils.request(OPERATIONS + dateInterval);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при запросе операции';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operations = result.response;
        return returnObject;
    }

    public static async updateOperation(id: number, data: OperationUpdateDataType): Promise<OperationsReturnType> {
        const returnObject: OperationsReturnType = {
            error: false,
            redirect: null,
            operations: null,
        };

        const result = await HttpUtils.request(OPERATIONS + ApiEnum.DASHBOARD + id, MethodEnum.PUT, true, data);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при изменении операции';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operations = result.response;
        return returnObject;
    }

    static async createOperation(data) {
        const returnObject: OperationsReturnType = {
            error: false,
            redirect: null,
            operations: null,
        };

        const result = await HttpUtils.request(OPERATIONS, MethodEnum.POST, true, data);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при добавлении операции';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operations = result.response;
        return returnObject;
    }

    static async deleteOperation(id) {
        const returnObject: OperationsReturnType = {
            error: false,
            redirect: null,
            operations: null,
        };

        const result = await HttpUtils.request(OPERATIONS + ApiEnum.DASHBOARD + id, MethodEnum.DELETE, true);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при удалении операции';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operations = result.response;
        return returnObject;
    }
}