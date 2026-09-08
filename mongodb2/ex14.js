db.orders.aggregate([
  {
    $match: {
      amount: { $gt: 50000 }
    }
  },
  {
    $sort: {
      amount: -1
    }
  },
  {
    $project: {
      _id: 0,
      orderId: 1,
      customerId: 1,
      amount: 1,
      paymentMethod: 1,
      status: 1
    }
  }
])