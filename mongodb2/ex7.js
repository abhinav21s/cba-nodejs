db.orders.aggregate([
  {
    $group: {
      _id: null,
      totalSales: { $sum: "$amount" }
    }
  }
])