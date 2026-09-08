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
      _id: "$product.category",
      products: {
        $addToSet: "$product.productId"
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
      },
      profit: {
        $sum: {
          $multiply: [
            "$items.quantity",
            {
              $subtract: [
                "$items.unitPrice",
                "$product.costPrice"
              ]
            }
          ]
        }
      },
      sellingPrices: {
        $push: "$items.unitPrice"
      }
    }
  },
  {
    $project: {
      _id: 0,
      category: "$_id",
      uniqueProducts: {
        $size: "$products"
      },
      quantitySold: 1,
      revenue: 1,
      averageSellingPrice: {
        $round: [
          {
            $avg: "$sellingPrices"
          },
          2
        ]
      },
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
    $sort: {
      profit: -1
    }
  }
])