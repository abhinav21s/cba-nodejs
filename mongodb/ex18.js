db.customers.aggregate([
  { $unwind: "$orders" },

  {
    $group: {
      _id: "$city",
      averageOrderAmount: {
        $avg: "$orders.amount"
      }
    }
  },

  {
    $project: {
      _id: 0,
      city: "$_id",
      averageOrderAmount: 1
    }
  }
])