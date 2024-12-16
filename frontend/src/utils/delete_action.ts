// удаление категории дохода по id
function handler_delete_income(element: HTMLElement): void {
    const link: HTMLElement | null = document.getElementById('delete-btn');
    const id: string = element.id.replace(/[^0-9]/g, "")
    if (link) {
        (link as HTMLLinkElement).href = '/income/delete?id=' + id;
    }
}

// удаление категории расхода по id
function handler_delete_expenses(element: HTMLElement): void {
    const link: HTMLElement | null = document.getElementById('delete-btn');
    const id: string = element.id.replace(/[^0-9]/g, "")
    if (link) {
        (link as HTMLLinkElement).href = '/expense/delete?id=' + id;
    }
}

function handler_delete_operation(element: HTMLElement): void {
    const link: HTMLElement | null = document.getElementById('delete-btn');
    const id: string = element.id.replace(/[^0-9]/g, "")
    if (link) {
        (link as HTMLLinkElement).href = '/operations/delete?id=' + id;
    }
}