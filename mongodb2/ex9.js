db.orders.aggregate([
  {
    $match: {
      status: "Delivered"
    }
  },
  {
    $group: {
      _id: null,
      totalSales: { $sum: "$amount" },
      totalQuantitySold: { $sum: "$quantity" }
    }
  }
])