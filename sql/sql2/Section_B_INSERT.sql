-- SECTION B — INSERT

-- 1. Insert a new department
INSERT INTO Departments
VALUES (6, 'Operations', 'Chennai');

-- 2. Insert a new employee
INSERT INTO Employees
(
    employee_id, first_name, last_name, email, salary,
    hire_date, department_id, manager_id
)
VALUES
(
    111, 'Anil', 'Kumar', 'anil@company.com', 55000,
    '2024-01-15', 1, 101
);

