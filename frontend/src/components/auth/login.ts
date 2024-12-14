import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../service/auth-service";
import {FieldsInputType} from "../../types/fields-input.type";

export class Login {
    readonly openNewRoute: any;
    private rememberMeElement: HTMLElement | null = null;
    readonly commonErrorElement: HTMLElement | null = null;
    private fields: FieldsInputType[] | undefined;
    readonly processButton: HTMLElement | null = null;

    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.rememberMeElement = document.getElementById('rememberMeChecked');
        this.commonErrorElement = document.getElementById('common-error');
        this.processButton = document.getElementById('process-button')

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
        this.fields.forEach((item: FieldsInputType) => {
            (item.element as HTMLElement | null) = document.getElementById(item.id);
            if (item.element) {
                item.element.addEventListener('change', (event) => {
                    that.validateField.call(that, item, (event.target as HTMLInputElement));
                });
            }
        })

        if (this.processButton) {
            this.processButton.addEventListener('click', this.login.bind(this));
        }
    }

    private validateField(field: FieldsInputType, element: HTMLInputElement): boolean {
        if (!element.value || !element.value.match((field.regex as RegExp))) {
            element.classList.add('is-invalid');
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            field.valid = true;
        }

        return field.valid;
    }

    private async login(): Promise<any> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }
        if ((this.validateField)) {

            const loginResult = await AuthService.logIn({
                email: this.fields.find(field => field.id === 'emailInput').element.value,
                password: this.fields.find(field => field.id === 'passwordInput').element.value,
                rememberMe: (this.rememberMeElement as HTMLInputElement).checked,
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

            if (this.commonErrorElement) {
                this.commonErrorElement.style.display = 'block';
            }
        }
    }
}