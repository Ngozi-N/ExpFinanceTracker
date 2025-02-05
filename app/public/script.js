document.addEventListener("DOMContentLoaded", () => {
    loadTransactions();
});

function loadTransactions() {
    fetch("/transactions")
        .then(response => response.json())
        .then(transactions => {
            const list = document.getElementById("transaction-list");
            list.innerHTML = ""; // Clear previous content
            transactions.forEach(transaction => {
                const item = document.createElement("li");
                item.innerHTML = `<strong>${transaction.date}:</strong> ${transaction.description} - <span style="color:${transaction.amount < 0 ? 'red' : 'green'};">$${transaction.amount}</span>`;
                list.appendChild(item);
            });
        })
        .catch(error => console.error("Error loading transactions:", error));
}

function addTransaction() {
    const newTransaction = {
        date: new Date().toISOString().split("T")[0],
        description: "New Expense",
        amount: -10.00,
        category: "Miscellaneous"
    };

    fetch("/transactions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTransaction)
    })
    .then(response => response.json())
    .then(() => loadTransactions()) // Reload transaction list
    .catch(error => console.error("Error adding transaction:", error));
}
