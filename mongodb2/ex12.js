db.orders.aggregate([
  {
    $group: {
      _id: "$paymentMethod",
      numberOfOrders: { $sum: 1 },
      totalRevenue: { $sum: "$amount" }
    }
  },
  {
    $sort: {
      totalRevenue: -1
    }
  },
  {
    $project: {
      _id: 0,
      paymentMethod: "$_id",
      numberOfOrders: 1,
      totalRevenue: 1
    }
  }
])