# 2. Common Students Between Courses

python_students = {"Amit", "Rahul", "Priya", "Neha", "Kiran"}
sql_students = {"Rahul", "Priya", "Kiran", "Arun", "Vijay"}

print("Students learning both:", python_students & sql_students)
print("Students learning only Python:", python_students - sql_students)
print("Students learning only SQL:", sql_students - python_students)
print("Students learning at least one:", python_students | sql_students)
