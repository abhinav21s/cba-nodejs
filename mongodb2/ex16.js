db.orders.aggregate([
  {
    $match: {
      status: { $ne: "Cancelled" }
    }
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m",
          date: "$orderDate"
        }
      },
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: "$amount" }
    }
  },
  {
    $sort: {
      _id: 1
    }
  },
  {
    $project: {
      _id: 0,
      month: "$_id",
      totalOrders: 1,
      totalRevenue: 1
    }
  }
])