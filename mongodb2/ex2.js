db.products.find(
  {},
  { _id: 0, name: 1, category: 1, price: 1 }
).sort({ price: 1 })

db.products.find(
  {},
  { _id: 0, name: 1, category: 1, price: 1 }
).sort({ price: -1 })