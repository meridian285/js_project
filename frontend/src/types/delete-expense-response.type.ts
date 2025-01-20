import {ApiEnum} from "./api.enum";

export type DeleteExpenseResponseType = {
    error: false | string,
    redirect: null | ApiEnum,
    response: ExpenseResponse | null,
}

export type ExpenseResponse = {
    id: number,
    title: string,
}