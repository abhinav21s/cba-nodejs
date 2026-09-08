db.orders.aggregate([
  {
    $unwind: "$items"
  },
  {
    $group: {
      _id: "$customerId",
      totalOrders: {
        $addToSet: "$orderId"
      },
      totalProducts: {
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
      firstOrderDate: {
        $min: "$orderDate"
      },
      lastOrderDate: {
        $max: "$orderDate"
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
      membership: "$customer.membership",
      totalOrders: {
        $size: "$totalOrders"
      },
      totalProducts: 1,
      totalSpending: 1,
      averageOrderValue: {
        $round: [
          {
            $divide: [
              "$totalSpending",
              {
                $size: "$totalOrders"
              }
            ]
          },
          2
        ]
      },
      firstOrderDate: 1,
      lastOrderDate: 1
    }
  },
  {
    $addFields: {
      customerSegment: {
        $switch: {
          branches: [
            {
              case: {
                $gte: ["$totalSpending", 500000]
              },
              then: "Platinum"
            },
            {
              case: {
                $gte: ["$totalSpending", 200000]
              },
              then: "Gold"
            },
            {
              case: {
                $gte: ["$totalSpending", 50000]
              },
              then: "Silver"
            }
          ],
          default: "Bronze"
        }
      }
    }
  },
  {
    $sort: {
      totalSpending: -1
    }
  }
])