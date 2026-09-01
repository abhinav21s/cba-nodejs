const express = require("express");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let expenses = [];
let nextId = 1;

app.post("/expenses", (req, res) => {
  const { amount, category, date, description } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({ message: "amount, category, and date are required" });
  }

  const expense = {
    id: nextId++,
    amount: Number(amount),
    category,
    date,
    description: description || "",
  };

  expenses.push(expense);
  res.status(201).json(expense);
});

app.get("/expenses", (req, res) => {
  const { category } = req.query;
  const result = category
    ? expenses.filter((expense) => expense.category.toLowerCase() === category.toLowerCase())
    : expenses;

  res.json(result);
});

app.get("/expenses/total", (req, res) => {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  res.json({ total });
});

app.put("/expenses/:id", (req, res) => {
  const expense = expenses.find((item) => item.id === Number(req.params.id));

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  const { amount, category, date, description } = req.body;
  if (amount !== undefined) expense.amount = Number(amount);
  if (category !== undefined) expense.category = category;
  if (date !== undefined) expense.date = date;
  if (description !== undefined) expense.description = description;

  res.json(expense);
});

app.delete("/expenses/:id", (req, res) => {
  const beforeDelete = expenses.length;
  expenses = expenses.filter((expense) => expense.id !== Number(req.params.id));

  if (expenses.length === beforeDelete) {
    return res.status(404).json({ message: "Expense not found" });
  }

  res.json({ message: "Expense deleted" });
});

app.listen(PORT, () => {
  console.log(`Personal Expense Tracker API running on http://localhost:${PORT}`);
});
