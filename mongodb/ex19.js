db.customers.aggregate([
  { $unwind: "$orders" },

  {
    $group: {
      _id: "$name",
      totalSpent: { $sum: "$orders.amount" }
    }
  },

  { $sort: { totalSpent: -1 } },

  { $limit: 1 },

  {
    $project: {
      _id: 0,
      customerName: "$_id",
      totalSpent: 1
    }
  }
])