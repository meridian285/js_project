import {ApiEnum} from "./api.enum";

export type UpdateExpenseResponseType = {
    error: false | string,
    redirect: null | ApiEnum,
    title: UpdateExpense | null,
}

export type UpdateExpense = {
    id: number,
    title: string,
}