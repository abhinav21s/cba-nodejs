db.orders.aggregate([
  {
    $group: {
      _id: "$status",
      numberOfOrders: { $sum: 1 },
      totalAmount: { $sum: "$amount" },
      averageAmount: { $avg: "$amount" }
    }
  },
  {
    $sort: {
      numberOfOrders: -1
    }
  },
  {
    $project: {
      _id: 0,
      status: "$_id",
      numberOfOrders: 1,
      totalAmount: 1,
      averageAmount: 1
    }
  }
])