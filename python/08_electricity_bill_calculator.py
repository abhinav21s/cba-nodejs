# Electricity Bill Calculator

units = float(input("Enter units consumed: "))

if units < 0:
    print("Error: Units cannot be negative.")
    raise SystemExit

if units <= 100:
    cost_first = units * 2
    cost_next = 0
    cost_next_300 = 0
    cost_above_600 = 0
elif units <= 300:
    cost_first = 100 * 2
    cost_next = (units - 100) * 3
    cost_next_300 = 0
    cost_above_600 = 0
elif units <= 600:
    cost_first = 100 * 2
    cost_next = 200 * 3
    cost_next_300 = (units - 300) * 5
    cost_above_600 = 0
else:
    cost_first = 100 * 2
    cost_next = 200 * 3
    cost_next_300 = 300 * 5
    cost_above_600 = (units - 600) * 8

subtotal = cost_first + cost_next + cost_next_300 + cost_above_600

if subtotal > 5000:
    surcharge = subtotal * 0.10
else:
    surcharge = 0

total_bill = subtotal + surcharge

print("\n--- Detailed Bill ---")
print(f"Units consumed: {units:g}")
print(f"First 100 units @ ₹2: ₹{cost_first:.2f}")
print(f"Next 200 units @ ₹3: ₹{cost_next:.2f}")
print(f"Next 300 units @ ₹5: ₹{cost_next_300:.2f}")
print(f"Above 600 units @ ₹8: ₹{cost_above_600:.2f}")
print(f"Subtotal: ₹{subtotal:.2f}")
print(f"Surcharge (10%): ₹{surcharge:.2f}")
print(f"Total bill: ₹{total_bill:.2f}")
