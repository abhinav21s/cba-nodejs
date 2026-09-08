db.orders.aggregate([
  {
    $group: {
      _id: "$productId",
      totalQuantitySold: { $sum: "$quantity" },
      totalRevenue: { $sum: "$amount" },
      numberOfOrders: { $sum: 1 }
    }
  },
  {
    $match: {
      totalRevenue: { $gt: 50000 }
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
      productId: "$_id",
      totalQuantitySold: 1,
      totalRevenue: 1,
      numberOfOrders: 1
    }
  }
])