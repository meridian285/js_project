
// удаление категории дохода по id
function handler_delete_income(element) {
    const id = element.id.replace(/[^0-9]/g, "")
    document.getElementById('delete-btn').href = '/income/delete?id=' + id;
}

// удаление категории расхода по id
function handler_delete_expenses(element) {
    const id = element.id.replace(/[^0-9]/g, "")
    document.getElementById('delete-btn').href = '/expense/delete?id=' + id;
}

function handler_delete_operation(element) {
    const id = element.id.replace(/[^0-9]/g, "")
    document.getElementById('delete-btn').href = '/operations/delete?id=' + id;
}