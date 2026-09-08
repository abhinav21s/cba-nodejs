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
      category: {
        $first: "$product.category"
      },
      costPrice: {
        $first: "$product.costPrice"
      },
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
    $project: {
      _id: 0,
      productId: "$_id",
      productName: 1,
      category: 1,
      quantitySold: 1,
      revenue: 1,
      totalCost: {
        $multiply: [
          "$quantitySold",
          "$costPrice"
        ]
      }
    }
  },
  {
    $project: {
      productId: 1,
      productName: 1,
      category: 1,
      quantitySold: 1,
      revenue: 1,
      totalCost: 1,
      profit: {
        $subtract: [
          "$revenue",
          "$totalCost"
        ]
      }
    }
  },
  {
    $project: {
      productId: 1,
      productName: 1,
      category: 1,
      quantitySold: 1,
      revenue: 1,
      totalCost: 1,
      profit: 1,
      profitMargin: {
        $round: [
          {
            $multiply: [
              {
                $divide: [
                  "$profit",
                  "$revenue"
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
    $match: {
      profitMargin: {
        $gt: 10
      }
    }
  },
  {
    $sort: {
      profit: -1
    }
  }
])