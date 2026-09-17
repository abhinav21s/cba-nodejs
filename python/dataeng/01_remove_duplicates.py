# 1. Remove Duplicates While Preserving Order

numbers = [10, 20, 10, 30, 20, 40, 30, 50, 10]

seen = set()
result = []

for number in numbers:
    if number not in seen:
        seen.add(number)
        result.append(number)

print(result)
