export class Menu {
    constructor() {
        this.init();
    }

    private init() {
        document.addEventListener('DOMContentLoaded', () => {
            const menuDropdownLinkElement: HTMLElement | null = document.getElementById('menu-dropdown-link');
            const arrowElement: HTMLElement | null = document.getElementById('arrow');
            const menuDropdown: NodeListOf<Element> = document.querySelectorAll('.menu-dropdown-item');
            const listMainMenu: NodeListOf<Element> = document.querySelectorAll('.main-menu-item');
            const selectInterval: NodeListOf<Element> = document.querySelectorAll('.select-interval');
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
            menuDropdown.forEach((item: Element) => {
                item.addEventListener('click', event => {
                    if (event) {
                        menuDropdown.forEach(items => items.classList.remove('active'));
                        item.classList.add('active');
                    }
                });
            });

// Меню аккордеон
            listMainMenu.forEach((item: Element) => {
                item.addEventListener('click', (event: Event) => {
                    if (event) {
                        listMainMenu.forEach(items => items.classList.remove('active'));
                        item.classList.add('active');
                    }

                    if (event.target && event.target){
                        if ((event.target as Element).id === 'menu-dropdown-link') {
                            if (dropdownMenuElement) {
                                dropdownMenuElement.style.borderColor = '#0D6EFD';
                            }

                            if ((event.target as Element).classList.contains('collapsed')) {
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

                            if (menuDropdownLinkElement && arrowElement && categories) {
                                if (menuDropdownLinkElement.classList.contains('collapsed') && categories.classList.contains('show')) {
                                    arrowElement.style.transform = 'rotate(90deg)';
                                } else {
                                    arrowElement.style.transform = 'rotate(0deg)';
                                }
                            }

                            if (categories) {
                                categories.classList.remove('show');
                            }
                        }
                    }


                });
            });

// Выбор временного интервала
            selectInterval.forEach(item =>
                item.addEventListener('click', event => {
                    if (event) {
                        selectInterval.forEach(item => item.classList.remove('active'));
                        item.classList.add('active');
                    }
                }));

        })
    }
}





