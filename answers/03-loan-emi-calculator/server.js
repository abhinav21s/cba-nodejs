const express = require("express");

const app = express();
const PORT = 3003;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let calculations = [];
let nextId = 1;

app.post("/calculate-emi", (req, res) => {
  const { loanAmount, interestRate, tenureMonths } = req.body;

  if (!loanAmount || !interestRate || !tenureMonths) {
    return res.status(400).json({ message: "loanAmount, interestRate, and tenureMonths are required" });
  }

  const principal = Number(loanAmount);
  const monthlyRate = Number(interestRate) / 12 / 100;
  const months = Number(tenureMonths);
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalRepayment = emi * months;
  const totalInterest = totalRepayment - principal;

  const result = {
    id: nextId++,
    loanAmount: principal,
    interestRate: Number(interestRate),
    tenureMonths: months,
    monthlyEmi: Number(emi.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalRepayment: Number(totalRepayment.toFixed(2)),
  };

  calculations.push(result);
  res.json(result);
});

app.get("/calculations", (req, res) => {
  res.json(calculations);
});

app.listen(PORT, () => {
  console.log(`Loan EMI Calculator API running on http://localhost:${PORT}`);
});
