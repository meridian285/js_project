import {EXPENSES} from "../../../config/config";
import {ExpensesService} from "../service/expenses-service";

export class CreateExpense {
    constructor(openNewRoute) {
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
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.addEventListener('change', (event) => {
                that.validateField.call(that, item, event.target);
            });

            item.element.addEventListener('blur', (event) => {
                that.validateField.call(that, item, event.target);
            });

            if (item.id === 'inputName') {
                item.element.focus();
            }
        });

        this.saveButtonElement.addEventListener('click', this.createIncome.bind(this))
    }

    validateField(field, element) {
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
    async createIncome(e) {
        e.preventDefault();

        if (this.validateField) {

            await ExpensesService.createExpense({
                title: this.inputNameElement.value
            })

            document.getElementById('form').reset();
            this.openNewRoute(EXPENSES);
        }
    }
}