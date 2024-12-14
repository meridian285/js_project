import {MethodEnum} from "./method-enum";

export type ParamForResponseType = {
    method: MethodEnum,
    headers: Headers,
    body?: any,
}

export type Headers = {
    'Content-type': 'application/json',
    'Accept': 'application/json',
    "x-auth-token"?: string,
}