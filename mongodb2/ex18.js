db.orders.aggregate([
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: "$amount" },
      totalQuantity: { $sum: "$quantity" }
    }
  },
  {
    $match: {
      totalRevenue: { $gt: 50000 }
    }
  },
  {
    $project: {
      _id: 0,
      category: "$_id",
      totalRevenue: 1,
      totalQuantity: 1
    }
  },
  {
    $sort: {
      totalRevenue: -1
    }
  }
])