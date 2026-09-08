db.orders.aggregate([
  {
    $unwind: "$items"
  },
  {
    $group: {
      _id: "$customerId",
      orderIds: {
        $addToSet: "$orderId"
      },
      totalQuantity: {
        $sum: "$items.quantity"
      },
      totalSpending: {
        $sum: {
          $multiply: [
            "$items.quantity",
            "$items.unitPrice"
          ]
        }
      },
      mostExpensiveOrder: {
        $max: "$items.unitPrice"
      },
      minimumOrder: {
        $min: "$items.unitPrice"
      },
      cancelledOrders: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "Cancelled"]
            },
            1,
            0
          ]
        }
      },
      deliveredOrders: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "Delivered"]
            },
            1,
            0
          ]
        }
      },
      categories: {
        $push: "$items.productId"
      }
    }
  },
  {
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "customerId",
      as: "customer"
    }
  },
  {
    $unwind: "$customer"
  },
  {
    $project: {
      _id: 0,
      customerId: "$_id",
      customerName: "$customer.name",
      totalOrders: {
        $size: "$orderIds"
      },
      totalQuantity: 1,
      totalSpending: 1,
      averageOrderValue: {
        $round: [
          {
            $divide: [
              "$totalSpending",
              {
                $size: "$orderIds"
              }
            ]
          },
          2
        ]
      },
      mostExpensiveOrder: 1,
      minimumOrder: 1,
      cancelledOrders: 1,
      deliveredOrders: 1
    }
  },
  {
    $addFields: {
      customerType: {
        $switch: {
          branches: [
            {
              case: {
                $gte: ["$totalOrders", 20]
              },
              then: "Frequent Buyer"
            },
            {
              case: {
                $gte: ["$totalOrders", 10]
              },
              then: "Regular Buyer"
            },
            {
              case: {
                $gte: ["$totalOrders", 5]
              },
              then: "Occasional Buyer"
            }
          ],
          default: "Rare Buyer"
        }
      }
    }
  }
])