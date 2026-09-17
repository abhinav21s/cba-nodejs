# 3. Find Duplicate Values Using a Set

numbers = [12, 15, 12, 18, 20, 15, 25, 18, 30, 15]

seen = set()
duplicates = set()

for number in numbers:
    if number in seen:
        duplicates.add(number)
    else:
        seen.add(number)

print(duplicates)
