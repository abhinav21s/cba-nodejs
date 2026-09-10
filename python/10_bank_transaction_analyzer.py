# Bank Transaction Analyzer

transactions = [5000, -1200, -500, 3000, -800, 10000, -15000]

balance = 0
total_deposits = 0
total_withdrawals = 0
number_of_deposits = 0
number_of_withdrawals = 0
largest_deposit = None
largest_withdrawal = None

for transaction in transactions:
    if transaction == 0:
        continue

    if transaction > 0:
        balance += transaction
        total_deposits += transaction
        number_of_deposits += 1

        if largest_deposit is None or transaction > largest_deposit:
            largest_deposit = transaction

    else:
        withdrawal = abs(transaction)

        if withdrawal > balance:
            print(f"Insufficient balance for withdrawal of ₹{withdrawal:.2f}")
            continue

        balance -= withdrawal
        total_withdrawals += withdrawal
        number_of_withdrawals += 1

        if largest_withdrawal is None or withdrawal > largest_withdrawal:
            largest_withdrawal = withdrawal

        if balance < 0:
            print("Balance became negative. Stopping transaction processing.")
            break

print("\n--- Transaction Analysis ---")
print(f"Total deposits: ₹{total_deposits:.2f}")
print(f"Total withdrawals: ₹{total_withdrawals:.2f}")
print(f"Number of deposits: {number_of_deposits}")
print(f"Number of withdrawals: {number_of_withdrawals}")
print(f"Final balance: ₹{balance:.2f}")
print(f"Largest deposit: ₹{largest_deposit:.2f}" if largest_deposit is not None else "Largest deposit: None")
print(
    f"Largest withdrawal: ₹{largest_withdrawal:.2f}"
    if largest_withdrawal is not None
    else "Largest withdrawal: None"
)
