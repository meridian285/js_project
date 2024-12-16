import {OperationsService} from "../service/operations-service";
import {Layout} from "../layout";
import {ApiEnum} from "../../types/api.enum";
import {OperationsReturnType} from "../../types/operations-return.type";

export class Dashboard {
    readonly openNewRoute: any;
    private table: HTMLElement | null;
    readonly startDateInput: HTMLElement | null;
    readonly endDateInput: HTMLElement | null;
    readonly incomeDiagram: HTMLElement | null;
    readonly expensesDiagram: HTMLElement | null;

    // хотелось бы вот так записать, но такого класса нет, а файл Chart библиотечный как тут быть?
    // private chart = new Chart;
    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        this.table = document.getElementById('dataTable');
        this.startDateInput = document.getElementById('startDate');
        this.endDateInput = document.getElementById('endDate');

        this.incomeDiagram = document.getElementById('income-diagram');
        this.expensesDiagram = document.getElementById('expenses-diagram');

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
                            url = `?period=interval&dateFrom=${this.startDateInput ? ((this.startDateInput as HTMLInputElement).value) : null}&dateTo=${this.endDateInput ? this.endDateInput.value : null}`;
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

    private async getData(url: string): Promise<any> {
        const response: ApiEnum | OperationsReturnType = await OperationsService.getOperationWithFilter(url);

        if ((response as OperationsReturnType).error) {
            return (response as OperationsReturnType).redirect ? this.openNewRoute((response as OperationsReturnType).redirect) : null;
        }

        this.showDiagram((response as OperationsReturnType).operations);
    }

    private clearCanvas(element: HTMLElement): void {
        if (Chart.getChart(element)) {
            Chart.getChart(element).destroy();
        }
    }


    private showDiagram(data): void {

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
                    },
                    legend: {
                        align: 'start',
                        labels: {
                            generateLabels: chart => chart.data.labels.map((l, i) => ({
                                datasetIndex: 0,
                                index: i,
                                text: l.slice(0, 15),
                                fillStyle: chart.data.datasets[0].backgroundColor[i],
                                strokeStyle: chart.data.datasets[0].backgroundColor[i],
                            }))
                        }
                    }
                }
            }
        });

        new Chart(this.expensesDiagram, {
            type: 'pie',
            responsive: true,
            maintainAspectRatio: false,
            data: {
                labels: expensesDataName,
                datasets: [{
                    data: expensesData,
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Расходы',
                        color: '#290661',
                        font: {
                            size: 28
                        }
                    },
                    legend: {
                        align: 'start',
                        labels: {
                            generateLabels: chart => chart.data.labels.map((l, i) => ({
                                datasetIndex: 0,
                                index: i,
                                text: l.slice(0, 15),
                                fillStyle: chart.data.datasets[0].backgroundColor[i],
                                strokeStyle: chart.data.datasets[0].backgroundColor[i],
                            }))
                        }
                    }
                }
            }
        });
    }

    private content(): void {
        const selectInterval: NodeListOf<Element> = document.querySelectorAll('.select-interval');
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

        const menuDropdownLinkElement: HTMLElement | null = document.getElementById('menu-dropdown-link');
        const arrowElement: HTMLElement | null = document.getElementById('arrow');
        const menuDropdown: NodeListOf<Element> = document.querySelectorAll('.menu-dropdown-item');
        const listMainMenu: NodeListOf<Element> = document.querySelectorAll('.main-menu-item');
        const categories: HTMLElement | null = document.getElementById('categories');
        const dropdownMenuElement: HTMLElement | null = document.getElementById('dropdown-li');

        // Поворот стрелки при выборе меню аккордеона
        if (menuDropdownLinkElement) {
            menuDropdownLinkElement.onclick = () => {
                if (!menuDropdownLinkElement.classList.contains('collapsed')) {
                    if (arrowElement) {
                        arrowElement.style.transform = 'rotate(90deg)';
                    }
                } else {
                    if (arrowElement) {
                        arrowElement.style.transform = 'rotate(0deg)';
                    }
                }
            };
        }


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

                if ((event.target.id as string) === 'menu-dropdown-link') {
                    if (dropdownMenuElement) {
                        dropdownMenuElement.style.borderColor = '#0D6EFD';
                    }

                    if (event.target.classList.contains('collapsed')) {
                        event.target.style.borderBottomLeftRadius = '5px';
                        event.target.style.borderBottomRightRadius = '5px';
                    } else {
                        event.target.style.borderBottomLeftRadius = '0';
                        event.target.style.borderBottomRightRadius = '0';
                    }

                } else {
                    if (dropdownMenuElement) {
                        dropdownMenuElement.style.borderColor = 'transparent';
                    }

                    if (menuDropdownLinkElement && categories) {
                        if (menuDropdownLinkElement.classList.contains('collapsed') && categories.classList.contains('show')) {
                            if (arrowElement) {
                                arrowElement.style.transform = 'rotate(90deg)';
                            }
                        } else {
                            if (arrowElement) {
                                arrowElement.style.transform = 'rotate(0deg)';
                            }
                        }
                        categories.classList.remove('show');
                    }
                }
            });
        });
    }
}