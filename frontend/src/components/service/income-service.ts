import {HttpUtils} from "../../utils/http-utils";
import {ApiEnum} from "../../types/api.enum";
import {ResultHttpUtilsType} from "../../types/result-httpUtils.type";
import {GetIncomesResponseType} from "../../types/incomes/get-incomes-response.type";
import {GetIncomeResponseType} from "../../types/incomes/get-income-response.type";
import {UpdateIncomeResponseType} from "../../types/incomes/update-income-response.type";
import {MethodEnum} from "../../types/method-enum";
import {CreateIncomeResponseType} from "../../types/incomes/create-income-response.type";
import {DeleteIncomeResponseType} from "../../types/incomes/delete-income-response.type";

export class IncomeService{

    public static async getIncomes(): Promise<GetIncomesResponseType | ApiEnum> {
        const returnObject: GetIncomesResponseType = {
            error: false,
            redirect: null,
            incomes: null,
        }

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.GET_CATEGORIES_INCOME);

        if (result.redirect || result.error || !result.response && (result.response && (result.response.error || !result.response))) {
            returnObject.error = 'Ошибка при запросе категорий доходов';
            if (result.redirect) {
                return returnObject.redirect = result.redirect;
            }
        }

        returnObject.incomes = result.response;

        return returnObject;
    }

    static async getIncome(id: string): Promise<ApiEnum | GetIncomeResponseType> {
        const returnObject: GetIncomeResponseType = {
            error: false,
            redirect: null,
            income: null,
        };

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.GET_CATEGORIES_INCOME + '/' + id);

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

    static async updateIncome(id: number, data: { title: string }): Promise<ApiEnum | UpdateIncomeResponseType> {
        const returnObject: UpdateIncomeResponseType = {
            error: false,
            redirect: null,
            title: null,
        };

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.GET_CATEGORIES_INCOME + '/' + id, MethodEnum.PUT, true, data);

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

    static async createIncome(data: any): Promise<ApiEnum | CreateIncomeResponseType> {
        const returnObject: CreateIncomeResponseType = {
            error: false,
            redirect: null,
            title: null,
        };

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.GET_CATEGORIES_INCOME, MethodEnum.POST, true, data);

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

    static async deleteIncome(id: string): Promise<ApiEnum | DeleteIncomeResponseType> {
        const returnObject: DeleteIncomeResponseType = {
            error: false,
            redirect: null,
            title: null,
        };

        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.GET_CATEGORIES_INCOME + '/' + id, MethodEnum.DELETE, true);

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