db.orders.aggregate([
  {
    $group: {
      _id: null,
      averageOrderValue: { $avg: "$amount" }
    }
  }
])


//decimal
db.orders.aggregate([
  {
    $match: {
      status: "Delivered"
    }
  },
  {
    $group: {
      _id: null,
      averageOrderValue: { $avg: "$amount" }
    }
  },
  {
    $project: {
      _id: 0,
      averageOrderValue: {
        $round: ["$averageOrderValue", 2]
      }
    }
  }
])