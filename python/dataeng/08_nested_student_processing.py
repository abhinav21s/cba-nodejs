# 8. Nested List and Tuple Processing

students = [
    ("Amit", [80, 75, 90]),
    ("Priya", [85, 90, 95]),
    ("Rahul", [70, 65, 80]),
    ("Neha", [90, 88, 92])
]

student_results = []

for name, marks in students:
    total = sum(marks)
    average = total / len(marks)
    student_results.append((name, total, average))

    print(f"{name}: Total = {total}, Average = {average:.2f}")

highest_average_student = max(student_results, key=lambda student: student[2])
print("\nStudent with highest average:", highest_average_student)

print("\nStudents with average greater than 80:")
for student in student_results:
    if student[2] > 80:
        print(student)

unique_marks = {mark for name, marks in students for mark in marks}
print("\nAll unique marks:", unique_marks)
