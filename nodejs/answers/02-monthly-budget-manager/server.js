const express = require("express");

const app = express();
const PORT = 3002;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let income = 0;
let budgets = [];
let expenses = [];
let nextBudgetId = 1;
let nextExpenseId = 1;

app.post("/income", (req, res) => {
  income = Number(req.body.income);
  res.json({ income });
});

app.post("/budgets", (req, res) => {
  const { category, amount } = req.body;

  if (!category || !amount) {
    return res.status(400).json({ message: "category and amount are required" });
  }

  const budget = { id: nextBudgetId++, category, amount: Number(amount) };
  budgets.push(budget);
  res.status(201).json(budget);
});

app.post("/expenses", (req, res) => {
  const { category, amount, description } = req.body;

  if (!category || !amount) {
    return res.status(400).json({ message: "category and amount are required" });
  }

  const expense = {
    id: nextExpenseId++,
    category,
    amount: Number(amount),
    description: description || "",
  };

  expenses.push(expense);
  res.status(201).json(expense);
});

app.get("/dashboard", (req, res) => {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categories = budgets.map((budget) => {
    const spent = expenses
      .filter((expense) => expense.category.toLowerCase() === budget.category.toLowerCase())
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      category: budget.category,
      budget: budget.amount,
      spent,
      remaining: budget.amount - spent,
      warning: spent > budget.amount ? "Budget exceeded" : "Within budget",
    };
  });

  res.json({
    income,
    totalSpent,
    remainingIncome: income - totalSpent,
    categories,
  });
});

app.listen(PORT, () => {
  console.log(`Monthly Budget Manager API running on http://localhost:${PORT}`);
});
