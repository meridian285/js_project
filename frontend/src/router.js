import {Dashboard} from "./components/dashboard";
import {Login} from "./components/login";
import {SignUp} from "./components/signup";
import {IncomeAndExpenses} from "./components/income-and-expenses";
import {Income} from "./components/income";
import {Expenses} from "./components/expenses";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.bootstrapStylesElement = document.getElementById('bootstrap-styles');

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Dashboard',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard();
                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                },
                styles: ['auth.css'],
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/signup.html',
                useLayout: false,
                load: () => {
                    new SignUp();
                },
                styles: ['auth.css'],
            },
            {
                route: '/income-and-expenses',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/income-and-expenses/income-and-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeAndExpenses();
                }
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expenses/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expenses();
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/income/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Income();
                }
            },
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRout = window.location.pathname;
        history.pushState({}, '', url)
        await this.activateRoute(null, currentRout)
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const url = element.href.replace(window.location.origin, '');
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return
            }

            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);

            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                })
            }
        }

        const urlRout = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRout);


        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = `/css/${style}`;
                    document.head.insertBefore(link, this.bootstrapStylesElement);
                })
            }
            // проверяем есть ли поле title и меняем его на странице
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }


            if (newRoute.filePathTemplate) {
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    const contentLayoutPageElement = document.getElementById('content-layout');
                    contentLayoutPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                } else {
                    // this.contentPageElement = document.getElementById('content');
                    this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                }


                // let contentBlock = this.contentPageElement;
                // if (newRoute.useLayout) {
                //     this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                //     contentBlock = document.getElementById('content-layout');
                // }
                // contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());

            }


            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            window.location = '/';
        }
    }
}