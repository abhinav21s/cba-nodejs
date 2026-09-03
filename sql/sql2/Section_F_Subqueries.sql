-- SECTION F — SUBQUERIES
-- Existing examples

-- 18. Find employees earning more than average salary
SELECT *
FROM Employees
WHERE salary > (
    SELECT AVG(salary)
    FROM Employees
);

-- 19. Find the employee with the highest salary
SELECT *
FROM Employees
WHERE salary = (
    SELECT MAX(salary)
    FROM Employees
);

-- 20. Find employees working in the IT department using a subquery
SELECT *
FROM Employees
WHERE department_id = (
    SELECT department_id
    FROM Departments
    WHERE department_name = 'IT'
);

-- 21. Find departments having employees
SELECT *
FROM Departments
WHERE department_id IN (
    SELECT department_id
    FROM Employees
);

-- 22. Find employees earning more than their department's average salary
SELECT
    e.first_name,
    e.last_name,
    e.salary,
    e.department_id
FROM Employees e
WHERE e.salary > (
    SELECT AVG(e2.salary)
    FROM Employees e2
    WHERE e2.department_id = e.department_id
);

-- 23. Find employees working on projects with budget greater than 400000
SELECT
    first_name,
    last_name
FROM Employees
WHERE employee_id IN (
    SELECT employee_id
    FROM Employee_Projects
    WHERE project_id IN (
        SELECT project_id
        FROM Projects
        WHERE budget > 400000
    )
);


-- PRACTICE ANSWERS — SUBQUERIES

-- 11. Find the second-highest salary.
SELECT MAX(salary) AS second_highest_salary
FROM Employees
WHERE salary < (
    SELECT MAX(salary)
    FROM Employees
);

-- 12. Find employees earning less than the company average.
SELECT *
FROM Employees
WHERE salary < (
    SELECT AVG(salary)
    FROM Employees
);

-- 13. Find the department with the highest average salary.
SELECT
    d.department_id,
    d.department_name,
    AVG(e.salary) AS average_salary
FROM Departments d
INNER JOIN Employees e
    ON d.department_id = e.department_id
GROUP BY d.department_id, d.department_name
HAVING AVG(e.salary) = (
    SELECT MAX(avg_salary)
    FROM (
        SELECT AVG(salary) AS avg_salary
        FROM Employees
        GROUP BY department_id
    ) AS department_averages
);

-- 14. Find employees belonging to the department with the most employees.
SELECT *
FROM Employees
WHERE department_id = (
    SELECT department_id
    FROM Employees
    GROUP BY department_id
    ORDER BY COUNT(*) DESC
    LIMIT 1
);

-- 15. Find projects with a budget greater than the average project budget.
SELECT *
FROM Projects
WHERE budget > (
    SELECT AVG(budget)
    FROM Projects
);
