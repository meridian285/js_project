import {Layout} from "../layout";
import {OperationsService} from "../service/operations-service";
import {EDIT_OPERATION} from "../../../config/config";

export class Operations {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.table = document.getElementById('dataTable');
        this.startDateInput = document.getElementById('startDate');
        this.endDateInput = document.getElementById('endDate');

        Layout.getBalance(this.openNewRoute).then();
        Layout.showUserName();

        this.content();

        let url = `?period=interval&dateFrom=${new Date().toISOString().slice(0, 10)}&dateTo=${new Date().toISOString().slice(0, 10)}`;
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
                            url = `?period=interval&dateFrom=${this.startDateInput.value}&dateTo=${this.endDateInput.value}`;
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

    async getData(url) {

        const response = await OperationsService.getOperationWithFilter(url);

        if (response.error) {
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showTable(response.operations);
    }

    showTable(operations) {
        if (this.table) {
            this.table.innerHTML = '';
        }

        operations.forEach((item, index) => {
            const dateFormat = new Date(item.date);

            let color = 'text-success';
            let typeValue = 'доход';
            if (item.type === 'expense') {
                color = 'text-danger';
                typeValue = 'расход';
            }

            const trElement = document.createElement('tr');
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
                        
                        <a href="${EDIT_OPERATION}?id=${item.id}">
                            <img href="" src="../images/edit.png" alt="Изменить">
                        </a>
                    </td>
            `;
            this.table.appendChild(trElement);
        });
    }

    content() {
        const selectInterval = document.querySelectorAll('.select-interval');
        // Выбор временного интервала
        if (selectInterval) {
            selectInterval.forEach(item =>
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