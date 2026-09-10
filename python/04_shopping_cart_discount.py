# Shopping Cart Discount

num_products = int(input("Enter number of products: "))

total = 0

for i in range(1, num_products + 1):
    price = float(input(f"Enter price of product {i}: ₹"))

    if price < 0:
        print("Invalid price.")
        raise SystemExit

    total += price

if total >= 20000:
    discount_rate = 0.20
elif total >= 10000:
    discount_rate = 0.15
elif total >= 5000:
    discount_rate = 0.10
else:
    discount_rate = 0

discount = total * discount_rate

customer_type = input("Is the customer a member? (y/n): ").lower()

if customer_type == "y":
    member_discount = total * 0.05
else:
    member_discount = 0

total_discount = discount + member_discount
final_amount = total - total_discount

print(f"Original amount: ₹{total:.2f}")
print(f"Discount: ₹{total_discount:.2f}")
print(f"Final amount: ₹{final_amount:.2f}")
