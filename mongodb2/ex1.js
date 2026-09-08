
db.customers.createIndex({ city: 1 })


db.customers.find({ city: "Hyderabad" })


db.customers.find({ city: "Hyderabad" }).explain("executionStats")


db.customers.dropIndex({ city: 1 })