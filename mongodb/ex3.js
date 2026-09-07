db.customers.find(
  { city: "Bangalore" },
  { _id: 0, name: 1, city: 1, email: 1 }
)