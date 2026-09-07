db.customers.aggregate([
  { $unwind: "$orders" },

  { $match: {
      "orders.category": "Electronics"
  }},

  { $project: {
      _id: 0,
      customerName: "$name",
      product: "$orders.product",
      amount: "$orders.amount"
  }}
])