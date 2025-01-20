import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../service/auth-service";
import {ApiEnum} from "../../types/api.enum";

export class Logout {
    readonly openNewRoute: any;
    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute(ApiEnum.LOGIN);
        }

        this.logout().then();
    }

    async logout() {
        await AuthService.logOut({
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        })

        //Удаляются из localStorage токены и инфо
        AuthUtils.removeAuthInfo();

        this.openNewRoute(ApiEnum.LOGIN);
    }
}