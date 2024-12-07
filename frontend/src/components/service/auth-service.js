import {HttpUtils} from "../../utils/http-utils";
import {LOGIN, LOGOUT, POST, SIGNUP} from "../../../config/config";

export class AuthService {

    static async logIn(data) {
        const result = await HttpUtils.request(LOGIN, POST, false, data);

        if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken ||
            !result.response.tokens.refreshToken || !result.response.user.id || !result.response.user.name))) {
            return false;
        }
        return result.response;
    }

    static async signUp(data) {
        const result = await HttpUtils.request(SIGNUP, POST, false, data);

        if (result.error || !result.response || (result.response && (!result.response.user.id ||
            !result.response.user.email || !result.response.user.name || !result.response.user.lastName))) {

            return false;
        }

        return result.response;
    }

    static async logOut(data) {
        await HttpUtils.request(LOGOUT, POST, false, data);
    }
}