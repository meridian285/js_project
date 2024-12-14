import {ApiEnum} from "./api.enum";

export type ResultHttpUtilsType = {
    error: boolean,
    response: any | null,
    redirect?: ApiEnum,
}