db.orders.aggregate([
  {
    $match: {
      status: "Delivered",
      orderDate: {
        $gte: ISODate("2026-01-01"),
        $lt: ISODate("2027-01-01")
      }
    }
  },
  {
    $unwind: "$items"
  },
  {
    $group: {
      _id: {
        month: {
          $dateToString: {
            format: "%Y-%m",
            date: "$orderDate"
          }
        },
        orderId: "$orderId"
      },
      orderQuantity: {
        $sum: "$items.quantity"
      },
      grossSales: {
        $sum: {
          $multiply: [
            "$items.quantity",
            "$items.unitPrice"
          ]
        }
      },
      shippingRevenue: {
        $first: "$shippingCost"
      },
      tax: {
        $first: "$tax"
      }
    }
  },
  {
    $group: {
      _id: "$_id.month",
      totalOrders: {
        $sum: 1
      },
      totalQuantity: {
        $sum: "$orderQuantity"
      },
      grossSales: {
        $sum: "$grossSales"
      },
      shippingRevenue: {
        $sum: "$shippingRevenue"
      },
      tax: {
        $sum: "$tax"
      }
    }
  },
  {
    $project: {
      _id: 0,
      month: "$_id",
      totalOrders: 1,
      totalQuantity: 1,
      grossSales: 1,
      shippingRevenue: 1,
      tax: 1,
      averageOrderValue: {
        $round: [
          {
            $divide: [
              {
                $add: [
                  "$grossSales",
                  "$shippingRevenue",
                  "$tax"
                ]
              },
              "$totalOrders"
            ]
          },
          2
        ]
      }
    }
  },
  {
    $sort: {
      month: 1
    }
  }
])