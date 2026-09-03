-- SECTION A — SELECT
-- Existing examples

-- 1. Display all employees
SELECT * FROM Employees;

-- 2. Display employee name and salary
SELECT first_name, last_name, salary
FROM Employees;

-- 3. Find employees with salary greater than 60,000
SELECT *
FROM Employees
WHERE salary > 60000;

-- 4. Find employees from the IT department
SELECT *
FROM Employees
WHERE department_id = 1;

-- 5. Sort employees by salary descending
SELECT first_name, last_name, salary
FROM Employees
ORDER BY salary DESC;


-- PRACTICE ANSWERS — BASIC SQL

-- 1. Find all employees hired after 2021.
SELECT *
FROM Employees
WHERE hire_date > '2021-12-31';

-- 2. Display the top 3 highest-paid employees.
SELECT *
FROM Employees
ORDER BY salary DESC
LIMIT 3;

-- 3. Find employees whose name starts with S.
SELECT *
FROM Employees
WHERE first_name LIKE 'S%'
   OR last_name LIKE 'S%';

-- 4. Count the number of employees in each department.
SELECT department_id, COUNT(*) AS employee_count
FROM Employees
GROUP BY department_id;

-- 5. Find the total salary paid by the company.
SELECT SUM(salary) AS total_salary
FROM Employees;
