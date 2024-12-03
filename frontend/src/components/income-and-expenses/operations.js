import {Layout} from "../layout";
import {OperationsService} from "../service/operations-service";
import {EDIT_OPERATION} from "../../../config/config";
import {DateUtils} from "../../utils/date-utils";

export class Operations {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.table = document.getElementById('dataTable');
        this.startDateInput = document.getElementById('startDate');
        this.endDateInput = document.getElementById('endDate');

        Layout.getBalance(this.openNewRoute).then();
        Layout.getUserName(this.openNewRoute);

        this.content();

        let date = null;
        const dateInterval = document.querySelectorAll('.select-interval');
        dateInterval.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('active')) {
                    switch (item.id) {
                        case 'today':
                            date = DateUtils.today();
                            break;
                        case  'week':
                            date = DateUtils.lastWeekInterval();
                            break;
                        case 'month':
                            date = DateUtils.lastMothInterval();
                            break;
                        case 'year':
                            date = DateUtils.lastYearInterval();
                            break;
                        case 'all-time':
                            date = DateUtils.allTimeInterval();
                            break;
                        case 'interval':
                            date = DateUtils.selectInterval(this.startDateInput.value, this.endDateInput.value);
                            break;
                    }
                }
                this.getData(date).then();
            })
        })

        this.getData({dateFrom: new Date().toISOString().slice(0, 10), dateTo: new Date().toISOString().slice(0, 10)}).then();
    }

    async getData(date) {

        const interval = `?period=interval&dateFrom=${date.dateFrom}&dateTo=${date.dateTo}`;

        const response = await OperationsService.getOperationWithFilter(interval);

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