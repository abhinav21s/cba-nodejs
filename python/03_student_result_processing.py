# Student Result Processing

num_subjects = int(input("Enter number of subjects: "))

total = 0
failed_subject = False

for i in range(1, num_subjects + 1):
    marks = float(input(f"Enter marks for subject {i} (0-100): "))

    if marks < 0 or marks > 100:
        print("Invalid marks. Marks must be between 0 and 100.")
        raise SystemExit

    total += marks

    if marks < 35:
        failed_subject = True

percentage = total / num_subjects

if failed_subject:
    grade = "F"
    result = "Fail"
else:
    if percentage >= 90:
        grade = "A+"
    elif percentage >= 80:
        grade = "A"
    elif percentage >= 70:
        grade = "B"
    elif percentage >= 60:
        grade = "C"
    elif percentage >= 50:
        grade = "D"
    else:
        grade = "F"

    result = "Pass" if grade != "F" else "Fail"

print(f"Total marks: {total:.2f}")
print(f"Percentage: {percentage:.2f}%")
print(f"Grade: {grade}")
print(f"Result: {result}")
