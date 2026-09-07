db.customers.find(
  {},
  { _id: 0, name: 1, age: 1 }
)
.sort({ age: -1 })
.limit(3)