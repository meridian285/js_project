import {ApiEnum} from "../api.enum";


export type DeleteIncomeResponseType = {
    error: false | string,
    redirect: null | ApiEnum,
    title: IncomeResponse | null,
}

export type IncomeResponse = {
    id: number,
    title: string,
}