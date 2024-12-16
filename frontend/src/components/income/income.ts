import {IncomeService} from "../service/income-service";
import {ApiEnum} from "../../types/api.enum";
import {GetIncomesResponseType, IncomesResponse} from "../../types/incomes/get-incomes-response.type";

export class Income {
    readonly openNewRoute: any;
    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        this.getCards().then();
    }

    private async getCards()  {
        const response: ApiEnum | GetIncomesResponseType = await IncomeService.getIncomes();

        if ((response as GetIncomesResponseType).error) {
            return (response as GetIncomesResponseType).redirect ? this.openNewRoute((response as GetIncomesResponseType).redirect) : null;
        }

        this.showCards((response as GetIncomesResponseType).incomes as IncomesResponse[]);
    }

    private showCards(getCards: IncomesResponse[]): void {
        const newCard: HTMLElement | null = document.getElementById('newCard');

        getCards.forEach((item: IncomesResponse) => {
            const cardElement: HTMLDivElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.classList.add('h3');
            cardElement.classList.add('p-3');
            cardElement.classList.add('text-purple-dark');
            cardElement.id = `card-${item.id}`;
            cardElement.innerHTML = `
                    ${item.title}
                <div class="action pt-3">
                    <a href="${ApiEnum.INCOME_EDIT}?id=${item.id}"  class="btn btn-primary">Редактировать</a>
                    <a href="#" onclick="handler_delete_income(this)" class="delete-card btn btn-danger" id="btn-${item.id}" data-bs-toggle="modal"
                       data-bs-target="#exampleModal">Удалить</a>
                </div>
            `;

            if (newCard) {
                newCard.before(cardElement);
            }
        });
    }
}

