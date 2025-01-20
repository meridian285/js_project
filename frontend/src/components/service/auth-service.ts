import {HttpUtils} from "../../utils/http-utils";
import {ApiEnum} from "../../types/api.enum";
import {MethodEnum} from "../../types/method-enum";
import {LoginFieldsType} from "../../types/login-fields.type";
import {SignUpFieldsType} from "../../types/signUp-fields.type";
import {LogoutDataTypes} from "../../types/logout-data.types";
import {ResultHttpUtilsType} from "../../types/result-httpUtils.type";

export class AuthService {

    public static async logIn(data: LoginFieldsType): Promise<any> {
        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.LOGIN, MethodEnum.POST, false, data);

        if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken ||
            !result.response.tokens.refreshToken || !result.response.user.id || !result.response.user.name))) {
            return false;
        }
        return result.response;
    }

    public static async signUp(data: SignUpFieldsType): Promise<any> {
        const result: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.SIGNUP, MethodEnum.POST, false, data);

        if (result.error || !result.response || (result.response && (!result.response.user.id ||
            !result.response.user.email || !result.response.user.name || !result.response.user.lastName))) {

            return false;
        }

        return result.response;
    }

    static async logOut(data: LogoutDataTypes): Promise<void> {
        await HttpUtils.request(ApiEnum.LOGOUT, MethodEnum.POST, false, data);
    }
}