import {OperationsService} from "../service/operations-service";
import {Layout} from "../layout";
import {ApiEnum} from "../../types/api.enum";
import {OperationsReturnType} from "../../types/operations-return.type";
import {OperationResponseType} from "../../types/operation-response.type";
import {ChartDataType} from "../../types/chart-data.type";
import {
    ArcElement,
    Chart, Legend,
    LegendItem, PieController, Title, Tooltip,
} from "chart.js";

export class Dashboard {
    readonly openNewRoute: any;
    private table: HTMLElement | null;
    readonly startDateInput: HTMLElement | null;
    readonly endDateInput: HTMLElement | null;
    readonly incomeDiagramElement: HTMLElement | null = null;
    readonly expensesDiagram: HTMLElement | null;

    // хотелось бы вот так записать, но такого класса нет, а файл Chart библиотечный как тут быть?
    constructor(openNewRoute: any) {
        this.openNewRoute = openNewRoute;

        this.table = document.getElementById('dataTable');
        this.startDateInput = document.getElementById('startDate');
        this.endDateInput = document.getElementById('endDate');

        this.incomeDiagramElement = document.getElementById('income-diagram');
        this.expensesDiagram = document.getElementById('expenses-diagram');

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
                            url = `?period=interval&dateFrom=${this.startDateInput ? ((this.startDateInput as HTMLInputElement).value) : null}&dateTo=${this.endDateInput ? (this.endDateInput as HTMLInputElement).value : null}`;
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

        this.showDiagram(((response as OperationsReturnType).operations as OperationResponseType[]));
    }

    private clearCanvas(element: HTMLCanvasElement): void {
        if (Chart.getChart(element)) {
            Chart.getChart(element)?.destroy();
        }
    }

    private showDiagram(data: OperationResponseType[]): void {

        if (this.incomeDiagramElement) {
            this.clearCanvas(this.expensesDiagram as HTMLCanvasElement);
        }
        if (this.expensesDiagram) {
            this.clearCanvas(this.expensesDiagram as HTMLCanvasElement);
        }

        let incomeData: number[] = [];
        let incomeDataName: string[] = [];

        let expensesData: number[] = [];
        let expensesDataName: string[] = [];

        let newArray: ChartDataType[] = [];
        for (let i = 0; i < data.length; i++) {
            if (newArray.length === 0 || !newArray.find((item: ChartDataType) => item.category === data[i].category)) {
                newArray.push({type: data[i].type, category: data[i].category, amount: data[i].amount});
            } else {
                let count: ChartDataType | undefined = newArray.find((item: ChartDataType) => item.category === data[i].category);
                (count as ChartDataType).amount = (count as ChartDataType).amount + data[i].amount
            }
        }

        newArray.forEach((item: ChartDataType) => {
            if (item.type === 'expense') {
                expensesData.push(item.amount)
                expensesDataName.push(item.category)
            } else {
                incomeData.push(item.amount)
                incomeDataName.push(item.category)
            }
        })

        Chart.register(ArcElement, Tooltip, Legend, Title, PieController)

        if (this.incomeDiagramElement) {
            new Chart(this.incomeDiagramElement as HTMLCanvasElement, {
                type: 'pie',
                data: {
                    labels: incomeDataName,
                    datasets: [{
                        data: incomeData,
                        borderWidth: 1,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE5556', '#4BC0C0'],
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
                                generateLabels: (chart: Chart) => (chart.data.labels as string[]).map((l: string, i: number): LegendItem => {
                                    const backgroundColor = chart.data.datasets[0].backgroundColor as string[];
                                    return {
                                        datasetIndex: 0,
                                        index: i,
                                        text: l.slice(0, 15),
                                        fillStyle: backgroundColor[i],
                                        strokeStyle: backgroundColor[i],
                                    }
                                })
                            }
                        }
                    }
                }
            });
        }


        new Chart(this.expensesDiagram as HTMLCanvasElement, {
            type: 'pie',
            data: {
                labels: expensesDataName,
                datasets: [{
                    data: expensesData,
                    borderWidth: 1,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE5556', '#4BC0C0'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                            generateLabels: (chart: Chart) => (chart.data.labels as string[]).map((l: string, i: number): LegendItem => {
                                const backgroundColor = chart.data.datasets[0].backgroundColor as string[];
                                return {
                                    datasetIndex: 0,
                                    index: i,
                                    text: l.slice(0, 15),
                                    fillStyle: backgroundColor[i],
                                    strokeStyle: backgroundColor[i],
                                }
                            })
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

                if ((event.target as HTMLElement).id === 'menu-dropdown-link') {
                    if (dropdownMenuElement) {
                        dropdownMenuElement.style.borderColor = '#0D6EFD';
                    }

                    if ((event.target as HTMLElement).classList.contains('collapsed')) {
                        (event.target as HTMLElement).style.borderBottomLeftRadius = '5px';
                        (event.target as HTMLElement).style.borderBottomRightRadius = '5px';
                    } else {
                        (event.target as HTMLElement).style.borderBottomLeftRadius = '0';
                        (event.target as HTMLElement).style.borderBottomRightRadius = '0';
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