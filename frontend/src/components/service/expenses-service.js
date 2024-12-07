import {HttpUtils} from "../../utils/http-utils";
import {
    DELETE, DELETE_EXPENSE,
    GET_CATEGORIES_EXPENSE,
    POST,
    PUT
} from "../../../config/config";

export class ExpensesService{

    static async getExpenses() {
        const returnObject = {
            error: false,
            redirect: null,
            expenses: null,
        };

        const result = await HttpUtils.request(GET_CATEGORIES_EXPENSE);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при запросе категорий расходов';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
        }

        returnObject.expenses = result.response;
        return returnObject;
    }

    static async getExpense(id) {
        const returnObject = {
            error: false,
            redirect: null,
            expense: null,
        };

        const result = await HttpUtils.request(GET_CATEGORIES_EXPENSE + '/' + id);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при запросе категории расхода';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.expense = result.response;
        return returnObject;
    }

    static async updateExpense(id, data) {
        const returnObject = {
            error: false,
            redirect: null,
            title: null,
        };

        const result = await HttpUtils.request(GET_CATEGORIES_EXPENSE + '/' + id, PUT, true, data);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при изменении категории расхода';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.title = result.response;
        return returnObject;
    }

    static async createExpense(data) {
        const returnObject = {
            error: false,
            redirect: null,
            title: null,
        };

        const result = await HttpUtils.request(GET_CATEGORIES_EXPENSE, POST, true, data);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при добавлении категории расхода';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.title = result.response;
        return returnObject;
    }

    static async deleteExpense(id) {
        const returnObject = {
            error: false,
            redirect: null,
            title: null,
        };

        const result = await HttpUtils.request(GET_CATEGORIES_EXPENSE + '/' + id, DELETE);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при удалении категории расхода';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}