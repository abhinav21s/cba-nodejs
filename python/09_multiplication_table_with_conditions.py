# Multiplication Table with Conditions

number = int(input("Enter a number: "))

for i in range(1, 21):
    if i % 3 == 0:
        continue

    result = number * i

    if result > 100:
        break

    if result % 2 == 0:
        continue

    print(f"{number} x {i} = {result}")
