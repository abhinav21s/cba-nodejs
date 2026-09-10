# Prime Number Range

start = int(input("Enter start: "))
end = int(input("Enter end: "))

if start > end:
    start, end = end, start

primes = []

for number in range(max(2, start), end + 1):
    is_prime = True

    for divisor in range(2, int(number ** 0.5) + 1):
        if number % divisor == 0:
            is_prime = False
            break

    if is_prime:
        primes.append(number)

if primes:
    print("Primes:", *primes)
    print("Count:", len(primes))
    print("Sum:", sum(primes))
    print("Largest:", max(primes))
else:
    print("Primes: None")
    print("Count: 0")
    print("Sum: 0")
    print("Largest: None")
