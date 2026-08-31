const express = require("express");

const app = express();
const PORT = 3010;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const users = [
  { id: 1, username: "employee1", password: "pass123", role: "employee" },
  { id: 2, username: "manager1", password: "pass123", role: "manager" },
];
let expenses = [];
let nextExpenseId = 1;

function getUser(req) {
  return users.find((user) => user.id === Number(req.header("user-id")));
}

function requireRole(role) {
  return (req, res, next) => {
    const user = getUser(req);

    if (!user || user.role !== role) {
      return res.status(403).json({ message: `${role} access required` });
    }

    req.user = user;
    next();
  };
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((item) => item.username === username && item.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid login" });
  }

  res.json({ id: user.id, username: user.username, role: user.role });
});

app.post("/expenses", requireRole("employee"), (req, res) => {
  const { amount, category, receiptFileName, description } = req.body;

  if (!amount || !category) {
    return res.status(400).json({ message: "amount and category are required" });
  }

  const expense = {
    id: nextExpenseId++,
    employeeId: req.user.id,
    amount: Number(amount),
    category,
    receiptFileName: receiptFileName || "",
    description: description || "",
    status: "Pending",
  };

  expenses.push(expense);
  res.status(201).json(expense);
});

app.get("/manager/expenses", requireRole("manager"), (req, res) => {
  const { status } = req.query;
  res.json(status ? expenses.filter((expense) => expense.status === status) : expenses);
});

app.patch("/manager/expenses/:id/review", requireRole("manager"), (req, res) => {
  const expense = expenses.find((item) => item.id === Number(req.params.id));
  const { status } = req.body;

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "status must be Approved or Rejected" });
  }

  expense.status = status;
  expense.reviewedBy = req.user.id;
  res.json(expense);
});

app.listen(PORT, () => {
  console.log(`Expense Approval API running on http://localhost:${PORT}`);
});
