# 9. Unique Products From Orders

orders = [
    ("ORD001", ["Laptop", "Mouse", "Keyboard"]),
    ("ORD002", ["Mouse", "Monitor"]),
    ("ORD003", ["Laptop", "Mouse", "Headset"]),
    ("ORD004", ["Keyboard", "Monitor", "Mouse"])
]

order_sets = {order_id: set(products) for order_id, products in orders}

unique_products = set()
for products in order_sets.values():
    unique_products.update(products)

print("All unique products:", unique_products)
print("Number of unique products:", len(unique_products))

print("Products purchased in ORD001 and ORD003:",
      order_sets["ORD001"] & order_sets["ORD003"])

print("Products in ORD001 but not in ORD002:",
      order_sets["ORD001"] - order_sets["ORD002"])

common_to_all_orders = set.intersection(*order_sets.values())
print("Products common to all orders:", common_to_all_orders)
