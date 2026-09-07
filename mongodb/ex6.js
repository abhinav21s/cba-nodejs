db.customers.find({
  membership: { $in: ["Gold", "Platinum"] }
})