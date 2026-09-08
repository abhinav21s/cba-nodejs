db.orders.aggregate([
  {
    $match: {
      status: { $ne: "Cancelled" },
      orderDate: { $gt: ISODate("2024-05-01") }
    }
  },
  {
    $group: {
      _id: "$category",
      numberOfOrders: { $sum: 1 },
      totalQuantitySold: { $sum: "$quantity" },
      totalRevenue: { $sum: "$amount" },
      averageOrderValue: { $avg: "$amount" }
    }
  },
  {
    $match: {
      totalRevenue: { $gt: 30000 }
    }
  },
  {
    $project: {
      _id: 0,
      category: "$_id",
      numberOfOrders: 1,
      totalQuantitySold: 1,
      totalRevenue: 1,
      averageOrderValue: {
        $round: ["$averageOrderValue", 2]
      }
    }
  },
  {
    $sort: {
      totalRevenue: -1
    }
  }
])