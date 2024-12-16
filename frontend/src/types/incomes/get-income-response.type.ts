import {ApiEnum} from "../api.enum";


export type GetIncomeResponseType = {
    error: false | string,
    redirect: null | ApiEnum,
    income: IncomeResponse | null,
}

export type IncomeResponse = {
    id: number,
    title: string,
}