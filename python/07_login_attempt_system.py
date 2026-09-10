# Login Attempt System

correct_username = "admin"
correct_password = "Python@123"

max_attempts = 3

for attempt in range(1, max_attempts + 1):
    username = input("Enter username: ")
    password = input("Enter password: ")

    if username == correct_username:
        if password == correct_password:
            print("Login successful")
            break
        else:
            print("Incorrect password")
    else:
        print("User not found")

    if attempt == max_attempts:
        print("Account locked")
        break

    print(f"Attempts remaining: {max_attempts - attempt}")
