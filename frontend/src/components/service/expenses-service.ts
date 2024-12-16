import {HttpUtils} from "../../utils/http-utils";
import {ApiEnum} from "../../types/api.enum";
import {MethodEnum} from "../../types/method-enum";
import {ResultHttpUtilsType} from "../../types/result-httpUtils.type";
import {GetExpensesResponseType} from "../../types/get-expenses-response.type";
import {UpdateExpenseResponseType} from "../../types/update-expense-response.type";
import {GetExpenseResponseType} from "../../types/get-expense-response.type";
import {CreateExpenseResponseType} from "../../types/create-expense-response.type";
import {DeleteExpenseResponseType} from "../../types/delete-expense-response.type";

export class ExpensesService{

    public static async getExpenses(): Promise<GetExpensesResponseType | ApiEnum> {
        const returnObject: GetExpensesResponseType = {
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

    public static async getExpense(id: string): Promise<ApiEnum | GetExpenseResponseType> {
        const returnObject: GetExpenseResponseType = {
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

    public static async updateExpense(id: number, data: { title: string }): Promise<ApiEnum | UpdateExpenseResponseType> {
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

    public static async createExpense(data: { title: string; }): Promise<ApiEnum | CreateExpenseResponseType> {
        const returnObject: CreateExpenseResponseType = {
            error: false,
            redirect: null,
            expense: null,
        };

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.GET_CATEGORIES_EXPENSE, MethodEnum.POST, true, data);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при добавлении категории расхода';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.expense = result.response;
        return returnObject;
    }

    public static async deleteExpense(id: string): Promise<ApiEnum | DeleteExpenseResponseType> {
        const returnObject: DeleteExpenseResponseType = {
            error: false,
            redirect: null,
            response: null,
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