document.addEventListener('DOMContentLoaded', () => {
    const incomeDiagram = document.getElementById('income-diagram');
    let incomeData = [12, 19, 3, 5, 20, 3]

    new Chart(incomeDiagram, {
        type: 'pie',
        responsive: true,
        maintainAspectRatio: false,
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Временные данные',
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

    const expensesDiagram = document.getElementById('expenses-diagram');
    const expensesData = [12, 19, 3, 5, 20, 3];

    new Chart(expensesDiagram, {
        type: 'pie',
        responsive: true,
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Временные данные',
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
});


