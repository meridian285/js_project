import {Dashboard} from "./components/dashboard/dashboard";
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/signup";
import {Operations} from "./components/income-and-expenses/operations";
import {Income} from "./components/income/income";
import {Expenses} from "./components/expenses/expenses";
import {Logout} from "./components/auth/logout";
import {CreateIncome} from "./components/income/createIncome";
import {EditIncome} from "./components/income/editIncome";
import {CreateExpense} from "./components/expenses/createExpense";
import {DeleteIncome} from "./components/income/deleteIncome";
import {DeleteExpense} from "./components/expenses/deleteExpense";
import {CreateOperation} from "./components/income-and-expenses/create-operation";
import {EditOperation} from "./components/income-and-expenses/edit-operation";
import {FileUtils} from "./utils/file-utils";
import {EditExpense} from "./components/expenses/editExpense";
import {DeleteOperation} from "./components/income-and-expenses/delete-operation";
import {RouteType} from "./types/route.type";
import {ApiEnum} from "./types/api.enum";
import {Menu} from "./components/menu/menu";

export class Router {
    readonly titlePageElement: HTMLElement | null = null;
    readonly contentPageElement: HTMLElement | null = null;
    readonly bootstrapStylesElement: HTMLElement | null = null;
    private routes: RouteType[];

    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.bootstrapStylesElement = document.getElementById('bootstrap-styles');

        this.initEvents();
        this.routes = [
            {
                route: ApiEnum.DASHBOARD,
                title: 'Dashboard',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new Dashboard(this.openNewRoute.bind(this));
                    new Menu();
                },
                scripts: ['chart.umd.js'],
            },
            {
                route: ApiEnum.LOGIN,
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: (): void => {
                    new Login(this.openNewRoute.bind(this));
                },
                styles: ['auth.css'],
            },
            {
                route: ApiEnum.SIGNUP,
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/signup.html',
                useLayout: false,
                load: (): void => {
                    new SignUp(this.openNewRoute.bind(this));
                },
                styles: ['auth.css'],
            },
            {
                route: ApiEnum.LOGOUT,
                load: (): void => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: ApiEnum.EXPENSES,
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expenses/expenses.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new Expenses(this.openNewRoute.bind(this));
                    new Menu();
                },
                styles: ['expenses.css'],
            },

            {
                route: ApiEnum.CREATE_EXPENSES,
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/expenses/create-expenses.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new CreateExpense(this.openNewRoute.bind(this));
                    new Menu();
                },
                styles: ['create-expenses.css'],
            },
            {
                route: ApiEnum.EDIT_EXPENSES,
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/expenses/edit-expenses.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new EditExpense(this.openNewRoute.bind(this));
                    new Menu();
                },
                styles: ['edit-expenses.css'],
            },
            {
                route: ApiEnum.DELETE_EXPENSE,
                load: (): void => {
                    new DeleteExpense(this.openNewRoute.bind(this));
                    new Menu();
                }
            },
            {
                route: ApiEnum.INCOME,
                title: 'Доходы',
                filePathTemplate: '/templates/pages/income/income.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new Income(this.openNewRoute.bind(this));
                    new Menu();
                },
                styles: ['income.css'],
            },
            {
                route: ApiEnum.CREATE_INCOME,
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/income/create-income.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new CreateIncome(this.openNewRoute.bind(this));
                    new Menu();
                },
                styles: ['create-income.css'],
            },
            {
                route: ApiEnum.INCOME_EDIT,
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/income/edit-income.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new EditIncome(this.openNewRoute.bind(this));
                    new Menu();
                },
                styles: ['edit-income.css'],
            },
            {
                route: ApiEnum.DELETE_INCOME,
                load: () => {
                    new DeleteIncome(this.openNewRoute.bind(this));
                    new Menu();
                }
            },
            {
                route: ApiEnum.ROUTE_OPERATIONS,
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/income-and-expenses/operations.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new Operations(this.openNewRoute.bind(this));
                    new Menu();
                },
                styles: ['operations.css'],
            },
            {
                route: ApiEnum.CREATE_OPERATION,
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/income-and-expenses/create-operations.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new CreateOperation(this.openNewRoute.bind(this));
                    new Menu();
                },
                styles: ['create-operations.css'],
            },
            {
                route: ApiEnum.EDIT_OPERATION,
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/income-and-expenses/edit-operations.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new EditOperation(this.openNewRoute.bind(this));
                    new Menu();
                },
                styles: ['edit-operations.css'],
            },
            {
                route: ApiEnum.OPERATIONS_DELETE,
                load: (): void => {
                    new DeleteOperation(this.openNewRoute.bind(this));
                    new Menu();
                }
            },
        ];
    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    private async openNewRoute(url: string | ApiEnum): Promise<void> {
        const currentRout: string = window.location.pathname;
        const unused: string = '';
        const obj: {} = {};
        history.pushState(obj, unused, url);
        await this.activateRoute(null, currentRout);
    }

    private async clickHandler(e: any): Promise<void> {

        //не работает
        // let element: HTMLLinkElement | null = null;
        // let target = e.target as HTMLLinkElement;
        // if (target.nodeName === 'A') {
        //     element = target;
        // } else if (target.parentNode?.nodeName === 'A') {
        //     element = target;
        // }

        let element: HTMLLinkElement | null = null;
        if ((e.target as HTMLElement).nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const url: string | ApiEnum = element.href.replace(window.location.origin, '');
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return
            }

            await this.openNewRoute(url);
        }
    }

    private async activateRoute(e: Event | null, oldRoute: string | null = null): Promise<void> {
        if (oldRoute) {
            const currentRoute: RouteType | undefined = this.routes.find(item => item.route === oldRoute);

            if ((currentRoute as RouteType).scripts && ((currentRoute as RouteType).scripts as string[]).length > 0) {
                ((currentRoute as RouteType).scripts as string[]).forEach(script => {

                    (document.querySelector(`script[src='/js/${script}']`) as HTMLElement).remove();
                })
            }
            if ((currentRoute as RouteType).styles && ((currentRoute as RouteType).styles as string[]).length > 0) {
                ((currentRoute as RouteType).styles as string[]).forEach(style => {
                    (document.querySelector(`link[href='/css/${style}']`) as HTMLElement).remove();
                })
            }
        }

        const urlRout: string = window.location.pathname;
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRout);


        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    const link: HTMLLinkElement = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = `/css/${style}`;
                    document.head.insertBefore(link, this.bootstrapStylesElement);
                });
            }

            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script)
                }
            }

            // проверяем есть ли поле title и меняем его на странице
            if (newRoute.title) {
                if (this.titlePageElement) {
                    this.titlePageElement.innerText = newRoute.title;
                }
            }

            if (newRoute.filePathTemplate) {
                if (newRoute.useLayout) {
                    const contentLayoutPageElement: HTMLElement | null = document.getElementById('content-layout');
                    if (!contentLayoutPageElement) {
                        if (this.contentPageElement) {
                            this.contentPageElement.innerHTML = await fetch(((newRoute as RouteType).useLayout as string)).then(response => response.text());
                        }
                        const contentLayoutPageElement: HTMLElement | null = document.getElementById('content-layout');
                        if (contentLayoutPageElement) {
                            contentLayoutPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                        }
                    } else {
                        contentLayoutPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                    }
                } else {
                    if (this.contentPageElement) {
                        this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                    }
                }
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            (<any>window).location = ApiEnum.DASHBOARD;
        }
    }
}