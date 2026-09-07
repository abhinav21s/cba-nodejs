db.customers.aggregate([
  { $unwind: "$orders" },

  {
    $group: {
      _id: "$orders.category",
      totalSales: { $sum: "$orders.amount" }
    }
  },

  {
    $project: {
      _id: 0,
      category: "$_id",
      totalSales: 1
    }
  }
])