db.orders.find(
  {},
  {
    _id: 0,
    orderId: 1,
    customerId: 1,
    amount: 1,
    status: 1,
    orderDate: 1
  }
)
.sort({ orderDate: -1 })
.limit(5)