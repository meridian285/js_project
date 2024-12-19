import {Layout} from "../layout";
import {OperationsService} from "../service/operations-service";
import {ApiEnum} from "../../types/api.enum";
import {OperationsReturnType} from "../../types/operations-return.type";
import {OperationResponseType} from "../../types/operation-response.type";

export class Operations {
    readonly openNewRoute: any;
    readonly table: HTMLElement | null;
    private startDateInput: HTMLElement | null ;
    private endDateInput: HTMLElement | null;
    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        this.table = document.getElementById('dataTable');
        this.startDateInput = document.getElementById('startDate');
        this.endDateInput = document.getElementById('endDate');

        Layout.getBalance(this.openNewRoute).then();
        Layout.showUserName();

        this.content();

        let url: string = `?period=interval&dateFrom=${new Date().toISOString().slice(0, 10)}&dateTo=${new Date().toISOString().slice(0, 10)}`;
        const dateInterval = document.querySelectorAll('.select-interval');
        dateInterval.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('active')) {
                    switch (item.id) {
                        case  'week':
                            url = '?period=week';
                            break;
                        case 'month':
                            url = '?period=month';
                            break;
                        case 'year':
                            url = '?period=year';
                            break;
                        case 'all-time':
                            url = '?period=all';
                            break;
                        case 'interval':
                            url = `?period=interval&dateFrom=${(this.startDateInput as HTMLInputElement).value}&dateTo=${(this.endDateInput as HTMLInputElement).value}`;
                            break;
                        default:
                            url = `?period=interval&dateFrom=${new Date().toISOString().slice(0, 10)}&dateTo=${new Date().toISOString().slice(0, 10)}`;
                    }
                    this.getData(url).then();
                }
            })
        })
        this.getData(url).then();
    }

    private async getData(url: string): Promise<void | OperationsReturnType | ApiEnum | null> {

        const response: ApiEnum | OperationsReturnType = await OperationsService.getOperationWithFilter(url);

        if ((response as OperationsReturnType).error) {
            return (response as OperationsReturnType).redirect ? this.openNewRoute((response as OperationsReturnType).redirect) : null;
        }

        this.showTable(((response as OperationsReturnType).operations as OperationResponseType[]));
    }

    private showTable(operations: OperationResponseType[]): void {
        if (this.table) {
            this.table.innerHTML = '';
        }

        operations.forEach((item: OperationResponseType, index: number) => {
            const dateFormat: Date = new Date(item.date);

            let color: string = 'text-success';
            let typeValue: string = 'доход';
            if (item.type === 'expense') {
                color = 'text-danger';
                typeValue = 'расход';
            }

            const trElement: HTMLTableRowElement = document.createElement('tr');
            trElement.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td class="${color}">${typeValue}</td>
                    <td>${item.category}</td>
                    <td>${item.amount}$</td>
                    <td>${dateFormat.toLocaleDateString('ru-RU')}</td>
                    <td>${item.comment}</td>
                    <td>
                        <a href="#" onclick="handler_delete_operation(this)" id="btn-${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal" role="button">
                            <img src="../images/cart.png" alt="Корзина">
                        </a>
                        
                        <a href="${ApiEnum.EDIT_OPERATION}?id=${item.id}">
                            <img href="" src="../images/edit.png" alt="Изменить">
                        </a>
                    </td>
            `;
            if (this.table) {
                this.table.appendChild(trElement);
            }
        });
    }

    private content(): void {
        const selectInterval: NodeListOf<Element> = document.querySelectorAll('.select-interval');
        // Выбор временного интервала
        if (selectInterval) {
            selectInterval.forEach((item: Element) =>
                item.addEventListener('click', event => {
                    if (event) {
                        selectInterval.forEach(item => item.classList.remove('active'));
                        item.classList.add('active');
                    }
                })
            )
        }
    }
}