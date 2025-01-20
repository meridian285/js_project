import {HttpUtils} from "../utils/http-utils";
import {AuthUtils} from "../utils/auth-utils";
import {ResultHttpUtilsType} from "../types/result-httpUtils.type";
import {ApiEnum} from "../types/api.enum";

export class Layout {

    public static async getBalance(openNewRoute: any) {
        const balanceElement: HTMLElement | null = document.getElementById('balance');

        const response: ResultHttpUtilsType = await HttpUtils.request(ApiEnum.BALANCE)

        if (response.error) {
            return response.redirect ? openNewRoute(response.redirect) : null;
        }

        if (balanceElement) {
            balanceElement.innerText = response.response.balance + '$';
        }
    }

    public static showUserName(): void {
        const userName: HTMLElement | null = document.getElementById('userName');
        const userLastName: HTMLElement | null = document.getElementById('userLastName');

        const userInfo = JSON.parse(<string>AuthUtils.getAuthInfo(AuthUtils.userInfoKey));

        if (userInfo) {
            if (userName) {
                userName.innerText = userInfo.name + ' ';
            }
            if (userLastName) {
                userLastName.innerText = userInfo.lastName;
            }
        }
    }
}