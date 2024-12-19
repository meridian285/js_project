import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../service/auth-service";
import {ApiEnum} from "../../types/api.enum";
import {FieldsInputType} from "../../types/fields-input.type";

export class SignUp {
    readonly openNewRoute: any;
    readonly form: any | null = null;
    readonly fullNameElement: HTMLElement | null = null;
    private emailElement: HTMLElement | null = null;
    private passwordElement: HTMLElement | null = null;
    private repeatPasswordElement: HTMLElement | null = null;
    readonly commonErrorElement: HTMLElement | null = null;
    readonly fields: FieldsInputType[] | undefined;
    readonly processButton: HTMLElement | null = null;

    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute(ApiEnum.DASHBOARD);
        }

        this.form = document.getElementById('form');
        if (this.form) {
            this.form.reset();
        }

        this.fullNameElement = document.getElementById('fullNameInput');
        this.emailElement = document.getElementById('emailInput');
        this.passwordElement = document.getElementById('passwordInput');
        this.repeatPasswordElement = document.getElementById('repeatPasswordInput');
        this.commonErrorElement = document.getElementById('common-error');
        this.processButton = document.getElementById('process-button')

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

        const that: SignUp = this;
        this.fields.forEach((item: FieldsInputType) => {
            (item.element as HTMLInputElement) = <HTMLInputElement>document.getElementById(item.id);
            (item.element as HTMLInputElement).addEventListener('input', (event) => {
                that.validateField.call(that, item, (event.target as HTMLInputElement));
            });
        });

        if (this.processButton) {
            this.processButton.addEventListener('click', this.signUp.bind(this));
        }

    }

    private validateField(field: FieldsInputType, element: HTMLInputElement): boolean {
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

        if (!element.value || !element.value.match((field.regex as RegExp))) {
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
                const repeatPasswordInput: FieldsInputType | undefined = (this.fields as FieldsInputType[]).find(item => item.id === 'repeatPasswordInput');
                // const repeatPasswordInput: FieldsInputType = this.fields.find(item => item.id === 'repeatPasswordInput');
                const passwordInput: FieldsInputType | undefined = (this.fields as FieldsInputType[]).find(item => item.id === 'passwordInput');
                if (((repeatPasswordInput as FieldsInputType).element as HTMLInputElement).value !== ''
                    && ((repeatPasswordInput as FieldsInputType).element as HTMLInputElement).value === ((passwordInput as FieldsInputType).element as HTMLInputElement).value) {
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

    private async signUp(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }

        let arrayName = null;
        if (this.fullNameElement) {
            arrayName = (this.fullNameElement as HTMLInputElement).value.split(' ');
        }
        if ((this.validateField)) {

            const signUpResult = await AuthService.signUp({
                name: (arrayName as Array<string>)[0],
                lastName: (arrayName as Array<string>)[1],
                email: (this.emailElement as HTMLInputElement).value,
                password: (this.passwordElement as HTMLInputElement).value,
                passwordRepeat: (this.repeatPasswordElement as HTMLInputElement).value,
            });

            if (signUpResult) {
                return this.openNewRoute(ApiEnum.LOGIN);
            }

            if (this.commonErrorElement) {
                this.commonErrorElement.style.display = 'block';
            }
        }
    }
}
