# 4. Tuple Data Processing

employees = (
    ("E101", "Amit", 55000),
    ("E102", "Priya", 62000),
    ("E103", "Rahul", 48000),
    ("E104", "Neha", 75000)
)

print("Employee names:")
for employee in employees:
    print(employee[1])

highest_salary_employee = max(employees, key=lambda employee: employee[2])
print("\nHighest salary:", highest_salary_employee)

average_salary = sum(employee[2] for employee in employees) / len(employees)
print("Average salary:", average_salary)

print("\nEmployees earning more than 60000:")
for employee in employees:
    if employee[2] > 60000:
        print(employee)

employees_list = list(employees)
print("\nTuple converted to list:")
print(employees_list)
