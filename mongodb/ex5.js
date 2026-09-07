db.customers.find({
  $or: [
    {
      $and: [
        { gender: "Male" },
        { age: { $gt: 30 } }
      ]
    },
    { city: "Bangalore" }
  ]
})