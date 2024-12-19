import {ExpensesService} from "../service/expenses-service";
import {FieldsInputType} from "../../types/fields-input.type";
import {ApiEnum} from "../../types/api.enum";

export class CreateExpense {
    readonly openNewRoute: any;
    private inputNameElement: HTMLElement | null;
    readonly saveButtonElement: HTMLElement | null;
    private fields: FieldsInputType[];
    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        this.inputNameElement = document.getElementById('inputName');
        this.saveButtonElement = document.getElementById('createExpenses');

        this.fields = [
            {
                name: 'input-name',
                id: 'inputName',
                element: null,
                regex: /^(|[a-zA-Zа-яёА-ЯЁ][a-zA-Zа-яёА-ЯЁ\s]*)$/,
                valid: false,
            }
        ];

        const that = this;
        this.fields.forEach((item: FieldsInputType) => {
            (item.element as HTMLElement | null) = document.getElementById(item.id);
            (item.element as HTMLElement).addEventListener('change', (event) => {
                that.validateField.call(that, item, (event.target as HTMLInputElement));
            });

            (item.element as HTMLElement).addEventListener('blur', (event) => {
                that.validateField.call(that, item, (event.target as HTMLInputElement));
            });

            if (item.id === 'inputName') {
                (item.element as HTMLElement).focus();
            }
        });

        if (this.saveButtonElement) {
            this.saveButtonElement.addEventListener('click', this.createIncome.bind(this))
        }
    }

    private validateField(field: FieldsInputType, element: HTMLInputElement): boolean {
        if (field.id === 'inputName') {
            element.addEventListener('input', function () {
                element.value = element.value.replace(/^\s/, '');
            })
        }

        if (!element.value || element.value === '') {
            element.classList.add('is-invalid');
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            field.valid = true;
        }

        return field.valid;
    }
    private async createIncome(e: { preventDefault: () => void; }): Promise<void> {
        e.preventDefault();

        if ((this.validateField)) {

            await ExpensesService.createExpense({
                title: (this.inputNameElement as HTMLInputElement).value
            });

            const formElement: HTMLElement | null = document.getElementById('form');

            if (formElement) {
                (formElement as HTMLFormElement).reset();
            }

            this.openNewRoute(ApiEnum.EXPENSES);
        }
    }
}