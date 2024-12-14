import {HttpUtils} from "../../utils/http-utils";
import {DELETE, DELETE_INCOME, GET_CATEGORIES_INCOME, POST, PUT} from "../../../config/config";

export class IncomeService{

    static async getIncomes() {
        const returnObject = {
            error: false,
            redirect: null,
            incomes: null,
        }

        const result = await HttpUtils.request(GET_CATEGORIES_INCOME);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при запросе категорий доходов';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
        }

        returnObject.incomes = result.response;

        return returnObject;
    }

    static async getIncome(id) {
        const returnObject = {
            error: false,
            redirect: null,
            income: null,
        };

        const result = await HttpUtils.request(GET_CATEGORIES_INCOME + '/' + id);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при запросе категории дохода';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        returnObject.income = result.response;
        return returnObject;
    }

    static async updateIncome(id, data) {
        const returnObject = {
            error: false,
            redirect: null,
            title: null,
        };

        const result = await HttpUtils.request(GET_CATEGORIES_INCOME + '/' + id, PUT, true, data);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при изменении категории дохода';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.title = result.response;
        return returnObject;
    }

    static async createIncome(data) {
        const returnObject = {
            error: false,
            redirect: null,
            title: null,
        };

        const result = await HttpUtils.request(GET_CATEGORIES_INCOME, POST, true, data);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при добавлении категории дохода';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.title = result.response;
        return returnObject;
    }

    static async deleteIncome(id) {
        const returnObject = {
            error: false,
            redirect: null,
            title: null,
        };

        const result = await HttpUtils.request(GET_CATEGORIES_INCOME + '/' + id, DELETE, true);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при удалении категории дохода';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}