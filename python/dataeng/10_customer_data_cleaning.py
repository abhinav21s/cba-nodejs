# 10. Real-World Data Cleaning Challenge

customer_ids = [
    "C101", "C102", "C103", "C101",
    "C104", "C105", "C102", "C106",
    "C103", "C107", "C108", "C105"
]

active_customers = {
    "C101", "C103", "C105", "C107", "C109"
}

blocked_customers = (
    "C102", "C104", "C108"
)

unique_customers = set(customer_ids)
blocked_set = set(blocked_customers)

active_in_transactions = unique_customers & active_customers
blocked_in_transactions = unique_customers & blocked_set
neither_active_nor_blocked = unique_customers - active_customers - blocked_set

print("Unique customers from transactions:", unique_customers)
print("Customers who are active:", active_customers)
print("Customers who are blocked:", blocked_set)
print("Customers neither active nor blocked:", neither_active_nor_blocked)
print("Customers in transactions and currently active:",
      active_in_transactions)
print("Customers in transactions and blocked:",
      blocked_in_transactions)
print("Number of unique customers:", len(unique_customers))

valid_active_customers = sorted(active_in_transactions)
print("Final list of valid active customers:", valid_active_customers)
