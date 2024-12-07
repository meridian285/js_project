import {AuthUtils} from "../../utils/auth-utils";
import {LOGIN, POST} from "../../../config/config";
import {HttpUtils} from "../../utils/http-utils";
import {AuthService} from "../service/auth-service";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.rememberMeElement = document.getElementById('rememberMeChecked');
        this.commonErrorElement = document.getElementById('common-error');

        this.fields = [
            {
                name: 'email',
                id: 'emailInput',
                element: null,
                regex: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'passwordInput',
                element: null,
                valid: false,
            }
        ];
        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            if (item.element) {
                item.element.addEventListener('change', (event) => {
                    that.validateField.call(that, item, event.target);
                });
            }
        })

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.classList.add('is-invalid');
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            field.valid = true;
        }

        return field.valid;
    }

    async login() {
        this.commonErrorElement.style.display = 'none';
        if (this.validateField) {

            const loginResult = await AuthService.logIn({
                email: this.fields.find( field => field.id === 'emailInput').element.value,
                    password: this.fields.find( field => field.id === 'passwordInput').element.value,
                    rememberMe: this.rememberMeElement.checked,
            });

            if (loginResult) {
                // сохраняем данные в localStorage
                AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                    id: loginResult.user.id,
                    name: loginResult.user.name,
                    lastName: loginResult.user.lastName,
                });

                return this.openNewRoute('/');
            }

            this.commonErrorElement.style.display = 'block';

        }
    }
}