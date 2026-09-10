# Number Analysis

number = int(input("Enter a positive integer: "))

if number <= 0:
    print("Please enter a positive integer.")
    raise SystemExit

original = str(number)
digits = [int(digit) for digit in original]

print(f"Digits: {len(digits)}")
print(f"Sum: {sum(digits)}")
print(f"Largest digit: {max(digits)}")
print(f"Smallest digit: {min(digits)}")

if original == original[::-1]:
    print("Palindrome: Yes")
else:
    print("Palindrome: No")
