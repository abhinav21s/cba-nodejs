db.customers.updateOne(
  { customerId: 101 },
  { $set: { membership: "Platinum" } }
)