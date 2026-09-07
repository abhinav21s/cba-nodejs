db.customers.find({
  "orders.amount": { $gt: 50000 }
})