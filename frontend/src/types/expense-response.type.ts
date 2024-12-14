import {ApiEnum} from "./api.enum";

export type ExpenseResponseType = {
    error: false | string,
    redirect: null | ApiEnum,
    expense: ExpenseResponse | null,
}

export type ExpenseResponse = {
    id: number,
    title: string,
}