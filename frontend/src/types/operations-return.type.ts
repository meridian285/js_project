import {OperationResponseType} from "./operation-response.type";
import {ApiEnum} from "./api.enum";

export type OperationsReturnType = {
    error: boolean | string,
    redirect: null | ApiEnum,
    operations: OperationResponseType[] | null,
}

