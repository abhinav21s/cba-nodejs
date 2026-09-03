-- SECTION D — DELETE

-- 1. Delete an employee
DELETE FROM Employees
WHERE employee_id = 111;

-- 2. Delete projects with a budget less than 200000
DELETE FROM Projects
WHERE budget < 200000;


