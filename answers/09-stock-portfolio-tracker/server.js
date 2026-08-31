const express = require("express");

const app = express();
const PORT = 3009;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const mockPrices = {
  ABC: 1350,
  XYZ: 2300,
  TCS: 4200,
  INFY: 1600,
};
let stocks = [];
let nextId = 1;

app.post("/stocks", (req, res) => {
  const { symbol, quantity, buyPrice } = req.body;

  if (!symbol || !quantity || !buyPrice) {
    return res.status(400).json({ message: "symbol, quantity, and buyPrice are required" });
  }

  const stock = {
    id: nextId++,
    symbol: symbol.toUpperCase(),
    quantity: Number(quantity),
    buyPrice: Number(buyPrice),
  };

  stocks.push(stock);
  res.status(201).json(stock);
});

app.delete("/stocks/:id", (req, res) => {
  const beforeDelete = stocks.length;
  stocks = stocks.filter((stock) => stock.id !== Number(req.params.id));

  if (stocks.length === beforeDelete) {
    return res.status(404).json({ message: "Stock not found" });
  }

  res.json({ message: "Stock removed" });
});

app.get("/portfolio", (req, res) => {
  const holdings = stocks.map((stock) => {
    const currentPrice = mockPrices[stock.symbol] || stock.buyPrice;
    const investedAmount = stock.quantity * stock.buyPrice;
    const currentValue = stock.quantity * currentPrice;

    return {
      ...stock,
      currentPrice,
      investedAmount,
      currentValue,
      profitLoss: currentValue - investedAmount,
    };
  });

  res.json({
    holdings,
    investedAmount: holdings.reduce((sum, stock) => sum + stock.investedAmount, 0),
    portfolioValue: holdings.reduce((sum, stock) => sum + stock.currentValue, 0),
    profitLoss: holdings.reduce((sum, stock) => sum + stock.profitLoss, 0),
  });
});

app.listen(PORT, () => {
  console.log(`Stock Portfolio API running on http://localhost:${PORT}`);
});
