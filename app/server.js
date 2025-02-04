const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.static("public"));
app.use(express.json());

// Get all transactions
app.get("/transactions", (req, res) => {
    fs.readFile("./data/transactions.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ message: "Error reading transactions" });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Add a new transaction
app.post("/transactions", (req, res) => {
    fs.readFile("./data/transactions.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ message: "Error reading transactions" });
        } else {
            let transactions = JSON.parse(data);
            const newTransaction = req.body;
            newTransaction.id = transactions.length + 1;
            transactions.push(newTransaction);

            fs.writeFile("./data/transactions.json", JSON.stringify(transactions, null, 2), (err) => {
                if (err) {
                    res.status(500).json({ message: "Error saving transaction" });
                } else {
                    res.status(201).json(newTransaction);
                }
            });
        }
    });
});

app.listen(3000, () => {
    console.log("Finance Tracker running on port 3000");
});
