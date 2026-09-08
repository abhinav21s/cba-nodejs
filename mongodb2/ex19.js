// Create index
db.orders.createIndex({ customerId: 1 })

// Customer purchase analysis
db.orders.aggregate([
  {
    $group: {
      _id: "$customerId",
      totalOrders: { $sum: 1 },
      totalQuantity: { $sum: "$quantity" },
      totalSpent: { $sum: "$amount" }
    }
  },
  {
    $sort: {
      totalSpent: -1
    }
  },
  {
    $project: {
      _id: 0,
      customerId: "$_id",
      totalOrders: 1,
      totalQuantity: 1,
      totalSpent: 1
    }
  }
])