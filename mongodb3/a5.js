db.orders.aggregate([
  {
    $match: {
      status: "Delivered"
    }
  },
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "customerId",
      as: "customer"
    }
  },
  {
    $unwind: "$customer"
  },
  {
    $group: {
      _id: {
        state: "$customer.state",
        city: "$customer.city"
      },
      customers: {
        $addToSet: "$customer.customerId"
      },
      orders: {
        $sum: 1
      },
      totalSales: {
        $sum: {
          $reduce: {
            input: "$items",
            initialValue: 0,
            in: {
              $add: [
                "$$value",
                {
                  $multiply: [
                    "$$this.quantity",
                    "$$this.unitPrice"
                  ]
                }
              ]
            }
          }
        }
      },
      quantitySold: {
        $sum: {
          $reduce: {
            input: "$items",
            initialValue: 0,
            in: {
              $add: [
                "$$value",
                "$$this.quantity"
              ]
            }
          }
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      state: "$_id.state",
      city: "$_id.city",
      customers: {
        $size: "$customers"
      },
      orders: 1,
      totalSales: 1,
      averageOrderValue: {
        $round: [
          {
            $divide: [
              "$totalSales",
              "$orders"
            ]
          },
          2
        ]
      },
      quantitySold: 1
    }
  },
  {
    $group: {
      _id: null,
      regions: {
        $push: "$$ROOT"
      },
      companySales: {
        $sum: "$totalSales"
      }
    }
  },
  {
    $unwind: "$regions"
  },
  {
    $project: {
      _id: 0,
      state: "$regions.state",
      city: "$regions.city",
      customers: "$regions.customers",
      orders: "$regions.orders",
      totalSales: "$regions.totalSales",
      averageOrderValue: "$regions.averageOrderValue",
      quantitySold: "$regions.quantitySold",
      salesContribution: {
        $round: [
          {
            $multiply: [
              {
                $divide: [
                  "$regions.totalSales",
                  "$companySales"
                ]
              },
              100
            ]
          },
          2
        ]
      }
    }
  },
  {
    $sort: {
      totalSales: -1
    }
  }
])