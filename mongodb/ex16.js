db.customers.aggregate([
  { $unwind: "$orders" },

  {
    $group: {
      _id: "$name",
      totalOrderValue: { $sum: "$orders.amount" }
    }
  },

  {
    $project: {
      _id: 0,
      customerName: "$_id",
      totalOrderValue: 1
    }
  }
])