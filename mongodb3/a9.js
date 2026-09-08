db.orders.aggregate([
  {
    $match: {
      status: "Delivered"
    }
  },
  {
    $project: {
      month: {
        $dateToString: {
          format: "%Y-%m",
          date: "$orderDate"
        }
      },
      customerId: 1
    }
  },
  {
    $group: {
      _id: "$month",
      customers: {
        $addToSet: "$customerId"
      }
    }
  },
  {
    $sort: {
      _id: 1
    }
  },
  {
    $setWindowFields: {
      sortBy: {
        _id: 1
      },
      output: {
        previousCustomers: {
          $shift: {
            output: "$customers",
            by: -1
          }
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      month: "$_id",
      activeCustomers: {
        $size: "$customers"
      },
      previousMonthCustomers: {
        $ifNull: [
          "$previousCustomers",
          []
        ]
      }
    }
  },
  {
    $project: {
      month: 1,
      activeCustomers: 1,
      previousMonthCustomers: {
        $size: "$previousMonthCustomers"
      },
      returningCustomers: {
        $size: {
          $setIntersection: [
            "$previousMonthCustomers",
            "$$REMOVE"
          ]
        }
      }
    }
  }
])