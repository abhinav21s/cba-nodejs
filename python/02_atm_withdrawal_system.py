# ATM Withdrawal System

balance = float(input("Enter current account balance: ₹"))

while True:
    amount = float(input("\nEnter withdrawal amount (0 to exit): ₹"))

    if amount == 0:
        print("Thank you for using the ATM.")
        break

    if amount < 0:
        print("Invalid amount. Withdrawal must be positive.")
        continue

    if amount % 500 != 0:
        print("Invalid amount. Withdrawal must be a multiple of ₹500.")
        continue

    if amount > balance:
        print("Insufficient balance.")
        continue

    if balance - amount < 1000:
        print("Transaction denied. Minimum balance of ₹1,000 must be maintained.")
        continue

    balance -= amount
    print(f"Withdrawal successful. Remaining balance: ₹{balance:.2f}")

    choice = input("Do you want to make another withdrawal? (y/n): ").lower()
    if choice != "y":
        print("Thank you for using the ATM.")
        break
