import {ApiEnum} from "./api.enum";
import {OperationResponseType} from "./operation-response.type";


export type OperationReturnType = {
    error: boolean | string,
    redirect: null | ApiEnum,
    operation: OperationResponseType | null,
}

