
db.customers.find({ age: { $gt: 30 } })
  .explain("executionStats")


db.customers.createIndex({ age: 1 })

db.customers.find({ age: { $gt: 30 } })
  .explain("executionStats")