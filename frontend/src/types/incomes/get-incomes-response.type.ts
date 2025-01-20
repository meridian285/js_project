import {ApiEnum} from "../api.enum";

export type GetIncomesResponseType = {
    error: false | string,
    redirect: null | ApiEnum,
    incomes: IncomesResponse[] | null,
}

export type IncomesResponse = {
    id: number,
    title: string,
}