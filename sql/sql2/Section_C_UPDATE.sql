-- SECTION C — UPDATE

-- 1. Increase salary of employee 104
UPDATE Employees
SET salary = 65000
WHERE employee_id = 104;

-- 2. Increase salary by 10% for IT employees
UPDATE Employees
SET salary = salary * 1.10
WHERE department_id = 1;
