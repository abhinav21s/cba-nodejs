db.customers.aggregate([
  { $unwind: "$orders" },

  {
    $group: {
      _id: {
        customerId: "$customerId",
        name: "$name",
        city: "$city",
        membership: "$membership"
      },

      totalOrders: { $sum: 1 },

      deliveredOrders: {
        $sum: {
          $cond: [
            { $eq: ["$orders.status", "Delivered"] },
            1,
            0
          ]
        }
      },

      cancelledOrders: {
        $sum: {
          $cond: [
            { $eq: ["$orders.status", "Cancelled"] },
            1,
            0
          ]
        }
      },

      pendingOrders: {
        $sum: {
          $cond: [
            { $eq: ["$orders.status", "Pending"] },
            1,
            0
          ]
        }
      },

      totalSpent: {
        $sum: "$orders.amount"
      },

      averageOrderAmount: {
        $avg: "$orders.amount"
      },

      highestOrderAmount: {
        $max: "$orders.amount"
      }
    }
  },

  {
    $project: {
      _id: 0,
      customerName: "$_id.name",
      city: "$_id.city",
      membership: "$_id.membership",
      totalOrders: 1,
      deliveredOrders: 1,
      cancelledOrders: 1,
      pendingOrders: 1,
      totalSpent: 1,
      averageOrderAmount: 1,
      highestOrderAmount: 1
    }
  },

  { $sort: { totalSpent: -1 } }
])