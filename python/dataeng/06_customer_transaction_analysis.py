# 6. Customer Transaction Analysis

transactions = [
    ("C101", 5000),
    ("C102", 3000),
    ("C101", 2000),
    ("C103", 7000),
    ("C102", 1500),
    ("C104", 4000),
    ("C101", 1000)
]

unique_customers = {customer for customer, amount in transactions}

print("Unique customers:", unique_customers)
print("Total number of transactions:", len(transactions))
print("Total amount:", sum(amount for customer, amount in transactions))

print("\nTransactions above 4000:")
for transaction in transactions:
    if transaction[1] > 4000:
        print(transaction)

transaction_counts = {}
for customer, amount in transactions:
    transaction_counts[customer] = transaction_counts.get(customer, 0) + 1

multiple_transaction_customers = {
    customer for customer, count in transaction_counts.items() if count > 1
}

print("\nCustomers with more than one transaction:",
      multiple_transaction_customers)
