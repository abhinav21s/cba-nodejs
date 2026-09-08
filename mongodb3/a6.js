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
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "productId",
      as: "product"
    }
  },
  {
    $unwind: "$product"
  },
  {
    $group: {
      _id: "$items.productId",
      productName: {
        $first: "$product.name"
      },
      costPrice: {
        $first: "$product.costPrice"
      },
      quantitySold: {
        $sum: "$items.quantity"
      },
      originalSales: {
        $sum: {
          $multiply: [
            "$items.quantity",
            "$items.unitPrice"
          ]
        }
      },
      discountAmount: {
        $sum: {
          $multiply: [
            {
              $multiply: [
                "$items.quantity",
                "$items.unitPrice"
              ]
            },
            {
              $divide: [
                "$items.discount",
                100
              ]
            }
          ]
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      productId: "$_id",
      productName: 1,
      quantitySold: 1,
      originalSales: 1,
      discountAmount: 1,
      netSales: {
        $subtract: [
          "$originalSales",
          "$discountAmount"
        ]
      },
      profitBeforeDiscount: {
        $subtract: [
          "$originalSales",
          {
            $multiply: [
              "$quantitySold",
              "$costPrice"
            ]
          }
        ]
      }
    }
  },
  {
    $addFields: {
      profitAfterDiscount: {
        $subtract: [
          "$netSales",
          {
            $subtract: [
              "$originalSales",
              "$profitBeforeDiscount"
            ]
          }
        ]
      },
      discountPercentage: {
        $round: [
          {
            $multiply: [
              {
                $divide: [
                  "$discountAmount",
                  "$originalSales"
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
    $addFields: {
      profitMargin: {
        $multiply: [
          {
            $divide: [
              "$profitAfterDiscount",
              "$netSales"
            ]
          },
          100
        ]
      }
    }
  },
  {
    $project: {
      productId: 1,
      productName: 1,
      quantitySold: 1,
      originalSales: 1,
      discountAmount: {
        $round: ["$discountAmount", 2]
      },
      netSales: {
        $round: ["$netSales", 2]
      },
      profitBeforeDiscount: {
        $round: ["$profitBeforeDiscount", 2]
      },
      profitAfterDiscount: {
        $round: ["$profitAfterDiscount", 2]
      },
      discountPercentage: 1,
      profitMargin: {
        $round: ["$profitMargin", 2]
      }
    }
  },
  {
    $match: {
      discountPercentage: {
        $gt: 15
      },
      profitMargin: {
        $lt: 8
      }
    }
  }
])