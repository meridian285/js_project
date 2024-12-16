import {ExpensesService} from "../service/expenses-service";
import {ApiEnum} from "../../types/api.enum";
import {ExpensesResponse, GetExpensesResponseType} from "../../types/get-expenses-response.type";

export class Expenses {
    readonly openNewRoute: any;
    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        this.getCards().then();
    }

    private async getCards() {
        const response: GetExpensesResponseType | ApiEnum = await ExpensesService.getExpenses();

        if ((response as GetExpensesResponseType).error) {
            return (response as GetExpensesResponseType).redirect ? this.openNewRoute((response as GetExpensesResponseType).redirect) : null;
        }

        this.showCards(((response as GetExpensesResponseType).expenses as ExpensesResponse[]));
    }

    private showCards(getCards: ExpensesResponse[]): void {
        const newCard: HTMLElement | null = document.getElementById('newCard');

        getCards.forEach((item: ExpensesResponse) => {
            const cardElement: HTMLDivElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.classList.add('h3');
            cardElement.classList.add('p-3');
            cardElement.classList.add('text-purple-dark');
            cardElement.id = `card-${item.id}`;
            cardElement.innerHTML = `
                    ${item.title}
                <div class="action pt-3">
                    <a href="${ApiEnum.EDIT_EXPENSES}?id=${item.id}" class="btn btn-primary">Редактировать</a>
                    <a href="#" onclick="handler_delete_expenses(this)" class="delete-card btn btn-danger" id="btn-${item.id}" data-bs-toggle="modal"
                       data-bs-target="#exampleModal">Удалить</a>
                </div>
            `;
            if (newCard) {
                newCard.before(cardElement);
            }
        });
    }
}