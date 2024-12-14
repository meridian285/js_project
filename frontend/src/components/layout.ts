import {HttpUtils} from "../utils/http-utils";
import {BALANCE} from "../../config/config";
import {AuthUtils} from "../utils/auth-utils";

export class Layout {

    static async getBalance(openNewRoute) {
        const balanceElement = document.getElementById('balance');

        const response = await HttpUtils.request(BALANCE)

        if (response.error) {
            return response.redirect ? openNewRoute(response.redirect) : null;
        }

        if (balanceElement) {
            balanceElement.innerText = response.response.balance + '$';
        }
    }

    static showUserName() {
        const userName = document.getElementById('userName');
        const userLastName = document.getElementById('userLastName');

        const userInfo = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey))

        if (userInfo) {
            userName.innerText = userInfo.name + ' ';
            userLastName.innerText = userInfo.lastName;
        }
    }
}