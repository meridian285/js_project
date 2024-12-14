import {HttpUtils} from "../../utils/http-utils";
import {ApiEnum} from "../../types/api.enum";
import {MethodEnum} from "../../types/method-enum";
import {ResultHttpUtilsType} from "../../types/result-httpUtils.type";
import {ExpensesResponseType} from "../../types/expenses-response.type";
import {ExpenseResponseType} from "../../types/expense-response.type";
import {UpdateExpenseResponseType} from "../../types/update-expense-response.type";
import * as process from "process";

export class ExpensesService{

    public static async getExpenses(): Promise<ExpensesResponseType | ApiEnum> {
        const returnObject: ExpensesResponseType = {
            error: false,
            redirect: null,
            expenses: null,
        };

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.GET_CATEGORIES_EXPENSE);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при запросе категорий расходов';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
        }

        returnObject.expenses = result.response;
        return returnObject;
    }

    public static async getExpense(id: string): Promise<ApiEnum | ExpenseResponseType> {
        const returnObject: ExpenseResponseType = {
            error: false,
            redirect: null,
            expense: null,
        };

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.GET_CATEGORIES_EXPENSE + '/' + id);

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

    public static async updateExpense(id: number, data: string): Promise<ApiEnum | UpdateExpenseResponseType> {
        const returnObject: UpdateExpenseResponseType = {
            error: false,
            redirect: null,
            title: null,
        };

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.GET_CATEGORIES_EXPENSE + '/' + id, MethodEnum.PUT, true, data);

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

    public static async createExpense(data: string) {
        const returnObject = {
            error: false,
            redirect: null,
            title: null,
        };

        const result = await HttpUtils.request(ApiEnum.GET_CATEGORIES_EXPENSE, MethodEnum.POST, true, data);

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

    static async deleteExpense(id: number) {
        const returnObject = {
            error: false,
            redirect: null,
            title: null,
        };

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.GET_CATEGORIES_EXPENSE  + '/' + id, MethodEnum.DELETE);

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