import {ApiEnum} from "../api.enum";

export type UpdateIncomeResponseType = {
    error: false | string,
    redirect: null | ApiEnum,
    title: UpdateIncome | null,
}

export type UpdateIncome = {
    id: number,
    title: string,
}