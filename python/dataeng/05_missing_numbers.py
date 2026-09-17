# 5. Find Missing Numbers

numbers = [1, 2, 3, 5, 6, 8, 10]

all_numbers = set(range(1, 11))
given_numbers = set(numbers)

missing_numbers = all_numbers - given_numbers

print(missing_numbers)
