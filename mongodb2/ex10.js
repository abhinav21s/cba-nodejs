db.orders.aggregate([
  {
    $group: {
      _id: "$customerId",
      totalOrders: { $sum: 1 },
      totalAmountSpent: { $sum: "$amount" }
    }
  },
  {
    $match: {
      totalAmountSpent: { $gt: 50000 }
    }
  },
  {
    $sort: {
      totalAmountSpent: -1
    }
  },
  {
    $project: {
      _id: 0,
      customerId: "$_id",
      totalOrders: 1,
      totalAmountSpent: 1
    }
  }
])