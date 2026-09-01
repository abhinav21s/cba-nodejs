const express = require("express");

const app = express();
const PORT = 3008;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let transactions = [];
let nextId = 1;

app.post("/transactions", (req, res) => {
  const { type, amount, category, date, description } = req.body;

  if (!["income", "expense"].includes(type) || !amount || !category || !date) {
    return res.status(400).json({ message: "type, amount, category, and date are required" });
  }

  const transaction = {
    id: nextId++,
    type,
    amount: Number(amount),
    category,
    date,
    description: description || "",
  };

  transactions.push(transaction);
  res.status(201).json(transaction);
});

app.get("/transactions", (req, res) => {
  const { month, search } = req.query;
  let result = transactions;

  if (month) {
    result = result.filter((transaction) => transaction.date.startsWith(month));
  }

  if (search) {
    const text = search.toLowerCase();
    result = result.filter((transaction) =>
      transaction.category.toLowerCase().includes(text) ||
      transaction.description.toLowerCase().includes(text)
    );
  }

  res.json(result);
});

app.get("/summary", (req, res) => {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const byCategory = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((summary, transaction) => {
      summary[transaction.category] = (summary[transaction.category] || 0) + transaction.amount;
      return summary;
    }, {});

  res.json({ income, expenses, savings: income - expenses, byCategory });
});

app.listen(PORT, () => {
  console.log(`Personal Finance Dashboard API running on http://localhost:${PORT}`);
});
