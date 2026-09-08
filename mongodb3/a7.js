db.orders.aggregate([
  {
    $match: {
      status: "Delivered"
    }
  },
  {
    $unwind: "$items"
  },
  {
    $group: {
      _id: "$items.productId",
      quantitySold: {
        $sum: "$items.quantity"
      },
      revenue: {
        $sum: {
          $multiply: [
            "$items.quantity",
            "$items.unitPrice"
          ]
        }
      }
    }
  },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "productId",
      as: "product"
    }
  },
  {
    $unwind: "$product"
  },
  {
    $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "productId",
      as: "reviews"
    }
  },
  {
    $project: {
      _id: 0,
      productId: "$_id",
      productName: "$product.name",
      category: "$product.category",
      quantitySold: 1,
      revenue: 1,
      averageRating: {
        $round: [
          {
            $avg: "$reviews.rating"
          },
          2
        ]
      },
      totalReviews: {
        $size: "$reviews"
      },
      verifiedReviews: {
        $size: {
          $filter: {
            input: "$reviews",
            as: "review",
            cond: {
              $eq: [
                "$$review.verifiedPurchase",
                true
              ]
            }
          }
        }
      }
    }
  },
  {
    $addFields: {
      performance: {
        $switch: {
          branches: [
            {
              case: {
                $and: [
                  {
                    $gte: [
                      "$averageRating",
                      4.5
                    ]
                  },
                  {
                    $gt: [
                      "$quantitySold",
                      500
                    ]
                  }
                ]
              },
              then: "Star Performer"
            },
            {
              case: {
                $and: [
                  {
                    $gte: [
                      "$averageRating",
                      4.0
                    ]
                  },
                  {
                    $gt: [
                      "$quantitySold",
                      500
                    ]
                  }
                ]
              },
              then: "Good Performer"
            },
            {
              case: {
                $and: [
                  {
                    $lt: [
                      "$averageRating",
                      4.0
                    ]
                  },
                  {
                    $gt: [
                      "$quantitySold",
                      500
                    ]
                  }
                ]
              },
              then: "High Sales Low Rating"
            },
            {
              case: {
                $lt: [
                  "$quantitySold",
                  500
                ]
              },
              then: "Low Sales"
            }
          ],
          default: "Other"
        }
      }
    }
  }
])