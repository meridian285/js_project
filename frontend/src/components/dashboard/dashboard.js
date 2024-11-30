import {DateUtils} from "../../utils/date-utils";
import {OperationsService} from "../service/operations-service";

export class Dashboard {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.table = document.getElementById('dataTable');
        this.startDateInput = document.getElementById('startDate');
        this.endDateInput = document.getElementById('endDate');

        this.incomeDiagram = document.getElementById('income-diagram');
        this.expensesDiagram = document.getElementById('expenses-diagram');

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

        this.getData({
            dateFrom: new Date().toISOString().slice(0, 10),
            dateTo: new Date().toISOString().slice(0, 10)
        }).then();
    }

    async getData(date) {
        const interval = `?period=interval&dateFrom=${date.dateFrom}&dateTo=${date.dateTo}`;

        const response = await OperationsService.getOperationWithFilter(interval);

        if (response.error) {
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showDiagram(response.operations);
    }

    clearCanvas(element) {
        if (Chart.getChart(element)) {
            Chart.getChart(element).destroy();
        }
    }


    showDiagram(data) {

        this.clearCanvas(this.incomeDiagram);
        this.clearCanvas(this.expensesDiagram);

        let incomeData = [];
        let incomeDataName = [];

        let expensesData = [];
        let expensesDataName = [];

        let newArray = [];
        for (let i = 0; i < data.length; i++) {
            if (newArray.length === 0 || !newArray.find(item => item.category === data[i].category)) {
                newArray.push({type: data[i].type, category: data[i].category, amount: data[i].amount});
            } else {
                let count = newArray.find(item => item.category === data[i].category);
                count.amount = count.amount + data[i].amount
            }
        }

        newArray.forEach(item => {
            if (item.type === 'expense') {
                expensesData.push(item.amount)
                expensesDataName.push(item.category)
            } else {
                incomeData.push(item.amount)
                incomeDataName.push(item.category)
            }
        })

        new Chart(this.incomeDiagram, {
            type: 'pie',
            responsive: true,
            maintainAspectRatio: false,
            data: {
                labels: incomeDataName,
                datasets: [{
                    // label: 'Временные данные',
                    data: incomeData,
                    borderWidth: 1
                }]
            },
            options: {

                plugins: {
                    title: {
                        display: true,
                        text: 'Доходы',
                        color: '#290661',
                        font: {
                            size: 28
                        }
                    }
                }
            }
        });

        new Chart(this.expensesDiagram, {
            type: 'pie',
            responsive: true,
            data: {
                labels: expensesDataName,
                datasets: [{
                    // label: 'Временные данные',
                    data: expensesData,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,

                plugins: {
                    title: {
                        display: true,
                        text: 'Расходы',
                        color: '#290661',
                        font: {
                            size: 28
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 80,
                        fontColor: 'black'
                    }
                },
            }
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

        const menuDropdownLinkElement = document.getElementById('menu-dropdown-link');
        const arrowElement = document.getElementById('arrow');
        const menuDropdown = document.querySelectorAll('.menu-dropdown-item');
        const listMainMenu = document.querySelectorAll('.main-menu-item');
        const categories = document.getElementById('categories');
        const dropdownMenuElement = document.getElementById('dropdown-li');

        // Поворот стрелки при выборе меню аккордеона
        menuDropdownLinkElement.onclick = () => {
            if (!menuDropdownLinkElement.classList.contains('collapsed')) {
                arrowElement.style.transform = 'rotate(90deg)';
            } else {
                arrowElement.style.transform = 'rotate(0deg)';
            }
        };

        //Выбор пункта меню
        menuDropdown.forEach(item => {
            item.addEventListener('click', event => {
                if (event) {
                    menuDropdown.forEach(items => items.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        });

        // Меню аккордеон
        listMainMenu.forEach(item => {
            item.addEventListener('click', event => {

                listMainMenu.forEach(items => items.classList.remove('active'));
                item.classList.add('active');

                if (event.target.id === 'menu-dropdown-link') {
                    dropdownMenuElement.style.borderColor = '#0D6EFD';

                    if (event.target.classList.contains('collapsed')) {
                        event.target.style.borderBottomLeftRadius = '5px';
                        event.target.style.borderBottomRightRadius = '5px';
                    } else {
                        event.target.style.borderBottomLeftRadius = '0';
                        event.target.style.borderBottomRightRadius = '0';
                    }

                } else {
                    dropdownMenuElement.style.borderColor = 'transparent';

                    if (menuDropdownLinkElement.classList.contains('collapsed') && categories.classList.contains('show')) {
                        arrowElement.style.transform = 'rotate(90deg)';
                    } else {
                        arrowElement.style.transform = 'rotate(0deg)';
                    }
                    categories.classList.remove('show');
                }
            });
        });
    }
}