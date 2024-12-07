import {LOGIN, POST, SIGNUP} from "../../../config/config";
import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {AuthService} from "../service/auth-service";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        document.getElementById('form').reset();

        this.fullNameElement = document.getElementById('fullNameInput');
        this.emailElement = document.getElementById('emailInput');
        this.passwordElement = document.getElementById('passwordInput');
        this.repeatPasswordElement = document.getElementById('repeatPasswordInput');
        this.commonErrorElement = document.getElementById('common-error');

        this.fields = [
            {
                name: 'fullName',
                id: 'fullNameInput',
                element: null,
                regex: /^([А-ЯЁ][а-яё]{1,23})\s([А-ЯЁ][а-яё]{1,23})$/,
                valid: false,
            },
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
                regex: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'repeatPasswordInput',
                element: null,
                valid: false,
            }
        ];

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.addEventListener('input', (event) => {
                that.validateField.call(that, item, event.target);
            });
        });

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));

    }

    validateField(field, element) {
        if (field.id === 'fullNameInput') {
            element.addEventListener('input', function () {
                element.value = element.value.replace(/([0-9])/g, '');
                element.value = element.value.replace(/([a-z])/g, '');
                element.value = element.value.replace(/([A-Z])/g, '');
                element.value = element.value.replace(/( |^)[а-яё]/g, (item) => {
                    return item.toUpperCase();
                })
            })
        }

        if (!element.value || !element.value.match(field.regex)) {
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            element.classList.add('is-valid');
            field.valid = true;

            if (field.id === 'fullNameInput') {
                element.addEventListener('input', () => {
                    element.value = element.value.replace(/( |^)[а-яёa-z]/g, (item) => {
                        return item.toUpperCase();
                    })
                })
            }

            if (field.id === 'repeatPasswordInput') {
                const repeatPasswordInput = this.fields.find(item => item.id === 'repeatPasswordInput');
                const passwordInput = this.fields.find(item => item.id === 'passwordInput');
                if (repeatPasswordInput.element.value !== '' && repeatPasswordInput.element.value === passwordInput.element.value) {
                    element.classList.remove('is-invalid');
                    element.classList.add('is-valid');
                    field.valid = true;
                } else {
                    element.classList.remove('is-valid');
                    element.classList.add('is-invalid');
                    field.valid = false;
                }
            }
        }

        return field.valid;
    }

    async signUp() {
        this.commonErrorElement.style.display = 'none';
        const arrayName = this.fullNameElement.value.split(' ');
        if (this.validateField) {

            const signUpResult = await AuthService.signUp({
                name: arrayName[0],
                lastName: arrayName[1],
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.repeatPasswordElement.value,
            });

            if (signUpResult) {
                return this.openNewRoute(LOGIN);
            }

            this.commonErrorElement.style.display = 'block';
        }
    }
}
