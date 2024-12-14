import {ApiEnum} from "./api.enum";

export type ExpensesResponseType = {
    error: false | string,
    redirect: null | ApiEnum,
    expenses: ExpensesResponse | null,
}

export type ExpensesResponse = {
    id: number,
    title: string,
}