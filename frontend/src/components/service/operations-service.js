import {HttpUtils} from "../../utils/http-utils";
import {
    DELETE,
    OPERATIONS,
    POST,
    PUT
} from "../../../config/config";

export class OperationsService {

    static async getOperations() {
        const returnObject = {
            error: false,
            redirect: null,
            operations: null,
        }

        const result = await HttpUtils.request(OPERATIONS);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при запросе операций';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
        }

        returnObject.operations = result.response;
        return returnObject;
    }

    static async getOperation(id) {
        const returnObject = {
            error: false,
            redirect: null,
            operation: null,
        };

        const result = await HttpUtils.request(OPERATIONS + '/' + id);

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

    static async getOperationWithFilter(dateInterval) {
        const returnObject = {
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

    static async updateOperation(id, data) {
        const returnObject = {
            error: false,
            redirect: null,
            operations: null,
        };

        const result = await HttpUtils.request(OPERATIONS + '/' + id, PUT, true, data);

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
        const returnObject = {
            error: false,
            redirect: null,
            operation: null,
        };

        const result = await HttpUtils.request(OPERATIONS, POST, true, data);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при добавлении операции';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operation = result.response;
        return returnObject;
    }

    static async deleteOperation(id) {
        const returnObject = {
            error: false,
            redirect: null,
            response: null,
        };

        const result = await HttpUtils.request(OPERATIONS + '/' + id, DELETE, true);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при удалении операции';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.response = result.response;
        return returnObject;
    }
}