# Employee Bonus Calculator

salary = float(input("Enter employee salary: ₹"))
rating = int(input("Enter employee rating (1-5): "))

if rating == 5:
    bonus = salary * 0.20
elif rating == 4:
    bonus = salary * 0.15
elif rating == 3:
    bonus = salary * 0.10
elif rating == 2:
    bonus = salary * 0.05
elif rating == 1:
    bonus = 0
else:
    print("Invalid rating. Rating must be between 1 and 5.")
    raise SystemExit

if salary < 30000:
    bonus += 2000

final_salary = salary + bonus

print(f"Bonus: ₹{bonus:.2f}")
print(f"Final salary including bonus: ₹{final_salary:.2f}")
