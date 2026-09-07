db.customers.updateOne(
  { customerId: 101 },
  { $addToSet: { skills: "Scala" } }
)