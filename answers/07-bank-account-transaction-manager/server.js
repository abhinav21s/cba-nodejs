const express = require("express");

const app = express();
const PORT = 3007;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let openingBalance = 25000;
let transactions = [];
let nextId = 1;

function getCurrentBalance() {
  return transactions.reduce((balance, transaction) => {
    return transaction.type === "Credit"
      ? balance + transaction.amount
      : balance - transaction.amount;
  }, openingBalance);
}

app.post("/opening-balance", (req, res) => {
  openingBalance = Number(req.body.amount);
  transactions = [];
  res.json({ openingBalance, currentBalance: getCurrentBalance() });
});

app.post("/deposit", (req, res) => {
  const amount = Number(req.body.amount);
  const transaction = { id: nextId++, type: "Credit", amount, date: new Date().toISOString() };
  transactions.push(transaction);
  res.status(201).json({ transaction, currentBalance: getCurrentBalance() });
});

app.post("/withdraw", (req, res) => {
  const amount = Number(req.body.amount);

  if (amount > getCurrentBalance()) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  const transaction = { id: nextId++, type: "Debit", amount, date: new Date().toISOString() };
  transactions.push(transaction);
  res.status(201).json({ transaction, currentBalance: getCurrentBalance() });
});

app.get("/transactions", (req, res) => {
  res.json({ openingBalance, transactions, currentBalance: getCurrentBalance() });
});

app.listen(PORT, () => {
  console.log(`Bank Transaction API running on http://localhost:${PORT}`);
});
