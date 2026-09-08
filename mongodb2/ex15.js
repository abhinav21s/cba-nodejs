db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "customerId",
      as: "customer"
    }
  },
  {
    $unwind: "$customer"
  },
  {
    $group: {
      _id: "$customer.segment",
      numberOfOrders: { $sum: 1 },
      totalRevenue: { $sum: "$amount" },
      averageOrderValue: { $avg: "$amount" }
    }
  },
  {
    $project: {
      _id: 0,
      segment: "$_id",
      numberOfOrders: 1,
      totalRevenue: 1,
      averageOrderValue: 1
    }
  }
])