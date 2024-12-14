import {LOGIN} from "../../../config/config";
import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../service/auth-service";

export class Logout {
    readonly openNewRoute: any;
    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute(LOGIN);
        }

        this.logout().then();
    }

    async logout() {
        await AuthService.logOut({
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        })

        //Удаляются из localStorage токены и инфо
        AuthUtils.removeAuthInfo();

        this.openNewRoute(LOGIN);
    }
}