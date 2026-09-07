db.customers.find({
  skills: { $size: 3 }
})