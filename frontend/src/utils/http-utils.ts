import config from "../../config/config";
import {AuthUtils} from "./auth-utils";
import {MethodEnum} from "../types/method-enum";
import {ApiEnum} from "../types/api.enum";
import {ParamForResponseType} from "../types/param-for-response.type";
import {ResultHttpUtilsType} from "../types/result-httpUtils.type";

export class HttpUtils {
    public static async request(url: string, method:MethodEnum = MethodEnum.GET, useAuth: boolean = true, body: any | null = null): Promise<ResultHttpUtilsType> {

        const result: ResultHttpUtilsType = {
            error: false,
            response: null,
        };

        const params: ParamForResponseType = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        };

        let token = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    result.redirect = ApiEnum.LOGIN;
                } else {
                    const updateTokenResult: boolean = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = ApiEnum.LOGIN;
                    }
                }
            }
        }
        return result;
    }
}