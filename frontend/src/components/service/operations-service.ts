import {HttpUtils} from "../../utils/http-utils";
import {OperationsReturnType} from "../../types/operations-return.type";
import {ApiEnum} from "../../types/api.enum";
import {MethodEnum} from "../../types/method-enum";
import {ResultHttpUtilsType} from "../../types/result-httpUtils.type";
import {OperationReturnType} from "../../types/operation-return.type";
import {BodyOperationType} from "../../types/body-operation.type";

export class OperationsService {

    public static async getOperation(id: string): Promise<OperationReturnType | ApiEnum> {
        const returnObject: OperationReturnType = {
            error: false,
            redirect: null,
            operation : null,
        };

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.OPERATIONS + ApiEnum.DASHBOARD + id);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при запросе операции';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.operation = result.response;
        return returnObject;
    }

    public static async getOperationWithFilter(dateInterval: string): Promise<OperationsReturnType | ApiEnum> {
        const returnObject: OperationsReturnType = {
            error: false,
            redirect: null,
            operations: null,
        };

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.OPERATIONS + dateInterval);

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

    public static async updateOperation(id: number, data: BodyOperationType): Promise<OperationReturnType | ApiEnum> {
        const returnObject: OperationReturnType = {
            error: false,
            redirect: null,
            operation: null,
        };

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.OPERATIONS + '/' + id, MethodEnum.PUT, true, data);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при изменении операции';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operation = result.response;
        return returnObject;
    }

    static async createOperation(data: BodyOperationType): Promise<OperationsReturnType | ApiEnum> {
        const returnObject: OperationsReturnType = {
            error: false,
            redirect: null,
            operations: null,
        };

        const result:ResultHttpUtilsType = await HttpUtils.request(ApiEnum.OPERATIONS, MethodEnum.POST, true, data);

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

    public static async deleteOperation(id: string): Promise<OperationsReturnType | ApiEnum> {
        const returnObject: OperationsReturnType = {
            error: false,
            redirect: null,
            operations: null,
        };

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.OPERATIONS + ApiEnum.DASHBOARD + id, MethodEnum.DELETE, true);

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