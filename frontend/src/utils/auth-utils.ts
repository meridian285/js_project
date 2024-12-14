import config, {POST, REFRESH} from "../../config/config";
import {TokensType, UserInfoType} from "../types/tokens.type";
import {AuthDataType} from "../types/authData.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoKey: string = 'userInfo';
    private static isTokenRefreshing: boolean = false;

    public static setAuthInfo(accessToken: string | null, refreshToken: string | null, userInfo: UserInfoType | null = null): void {
        if (accessToken) {
            localStorage.setItem(this.accessTokenKey, accessToken);
        }
        if (refreshToken) {
            localStorage.setItem(this.refreshTokenKey, refreshToken);
        }
        if (userInfo) {
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }

    public static getAuthInfo(key:string | null = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoKey]: localStorage.getItem(this.userInfoKey),
            }
        }
    }

    public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken && !this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            const response: Response = await fetch(config.api + REFRESH, {
                method: POST,
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (response && response.status === 200) {
                this.isTokenRefreshing = false;
                const tokens = await response.json();
                if (tokens && !tokens.error) {
                    this.setAuthInfo(tokens.tokens.accessToken, tokens.tokens.refreshToken);
                    result = true;
                }
            }
        }

        if (!result) {
            this.removeAuthInfo();
        }

        return result;
    }
}