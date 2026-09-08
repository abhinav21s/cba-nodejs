db.orders.aggregate([
  {
    $facet: {

      sales: [
        {
          $unwind: "$items"
        },
        {
          $group: {
            _id: null,
            totalOrders: {
              $addToSet: "$orderId"
            },
            totalRevenue: {
              $sum: {
                $multiply: [
                  "$items.quantity",
                  "$items.unitPrice"
                ]
              }
            },
            totalQuantitySold: {
              $sum: "$items.quantity"
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalOrders: {
              $size: "$totalOrders"
            },
            totalRevenue: 1,
            totalQuantitySold: 1
          }
        },
        {
          $addFields: {
            averageOrderValue: {
              $round: [
                {
                  $divide: [
                    "$totalRevenue",
                    "$totalOrders"
                  ]
                },
                2
              ]
            }
          }
        }
      ],

      orders: [
        {
          $group: {
            _id: null,
            delivered: {
              $sum: {
                $cond: [
                  { $eq: ["$status", "Delivered"] },
                  1,
                  0
                ]
              }
            },
            cancelled: {
              $sum: {
                $cond: [
                  { $eq: ["$status", "Cancelled"] },
                  1,
                  0
                ]
              }
            },
            pending: {
              $sum: {
                $cond: [
                  { $eq: ["$status", "Pending"] },
                  1,
                  0
                ]
              }
            },
            totalOrders: {
              $sum: 1
            }
          }
        },
        {
          $project: {
            _id: 0,
            delivered: 1,
            cancelled: 1,
            pending: 1,
            cancellationRate: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        "$cancelled",
                        "$totalOrders"
                      ]
                    },
                    100
                  ]
                },
                2
              ]
            }
          }
        }
      ],

      customers: [
        {
          $group: {
            _id: "$customerId",
            totalSpent: {
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
            }
          }
        },
        {
          $group: {
            _id: null,
            totalCustomers: {
              $sum: 1
            },
            averageCustomerSpending: {
              $avg: "$totalSpent"
            },
            topCustomer: {
              $max: "$totalSpent"
            }
          }
        }
      ],

      reviews: [
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$rating"
            },
            totalReviews: {
              $sum: 1
            },
            verifiedReviews: {
              $sum: {
                $cond: [
                  "$verifiedPurchase",
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            averageRating: {
              $round: [
                "$averageRating",
                2
              ]
            },
            totalReviews: 1,
            verifiedReviews: 1
          }
        }
      ]
    }
  }
])