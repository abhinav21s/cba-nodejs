 
db.orders.createIndex({ customerId: 1, status: 1 })

 
db.orders.find({ customerId: "C101" })

 
db.orders.find({ customerId: "C101" })
  .explain("executionStats")