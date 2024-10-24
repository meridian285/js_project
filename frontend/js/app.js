const menuDropdownLinkElement = document.getElementById('menu-dropdown-link');
const arrowElement = document.getElementById('arrow');
const menuDropdown = document.querySelectorAll('.menu-dropdown-item');
const listMainMenu = document.querySelectorAll('.main-menu-item');
const selectInterval = document.querySelectorAll('.select-interval');
const categories = document.getElementById('categories');

//Поворот стрелки при выборе меню аккордеона
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
        if (event) {
            listMainMenu.forEach(items => items.classList.remove('active'));
            item.classList.add('active');
        }

        if (event.target.id === 'menu-dropdown-link') {
            if (event.target.classList.contains('collapsed')) {
                event.target.style.borderBottomLeftRadius = '5px';
                event.target.style.borderBottomRightRadius = '5px';
            } else {
                event.target.style.borderBottomLeftRadius = '0';
                event.target.style.borderBottomRightRadius = '0';
            }
        } else {
            if (menuDropdownLinkElement.classList.contains('collapsed') && categories.classList.contains('show')) {
                arrowElement.style.transform = 'rotate(90deg)';
            } else {
                arrowElement.style.transform = 'rotate(0deg)';
            }
            categories.classList.remove('show');
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



