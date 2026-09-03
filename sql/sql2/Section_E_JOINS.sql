-- SECTION E — JOINS
-- Existing examples

-- 12. INNER JOIN Employees and Departments
SELECT
    e.first_name,
    e.last_name,
    d.department_name
FROM Employees e
INNER JOIN Departments d
    ON e.department_id = d.department_id;

-- 13. LEFT JOIN
SELECT
    e.first_name,
    e.last_name,
    d.department_name
FROM Employees e
LEFT JOIN Departments d
    ON e.department_id = d.department_id;

-- 14. RIGHT JOIN
SELECT
    e.first_name,
    e.last_name,
    d.department_name
FROM Employees e
RIGHT JOIN Departments d
    ON e.department_id = d.department_id;

-- 15. JOIN Employees, Projects, and Employee_Projects
SELECT
    e.first_name,
    e.last_name,
    p.project_name,
    ep.role
FROM Employees e
INNER JOIN Employee_Projects ep
    ON e.employee_id = ep.employee_id
INNER JOIN Projects p
    ON ep.project_id = p.project_id;

-- 16. SELF JOIN — Employee and Manager
SELECT
    e.first_name AS employee_name,
    m.first_name AS manager_name
FROM Employees e
LEFT JOIN Employees m
    ON e.manager_id = m.employee_id;

-- 17. Find employees who are not assigned to any project
SELECT
    e.employee_id,
    e.first_name,
    e.last_name
FROM Employees e
LEFT JOIN Employee_Projects ep
    ON e.employee_id = ep.employee_id
WHERE ep.project_id IS NULL;


-- PRACTICE ANSWERS — JOINS

-- 6. Display employee name, department, and project.
SELECT
    e.first_name,
    e.last_name,
    d.department_name,
    p.project_name
FROM Employees e
INNER JOIN Departments d
    ON e.department_id = d.department_id
LEFT JOIN Employee_Projects ep
    ON e.employee_id = ep.employee_id
LEFT JOIN Projects p
    ON ep.project_id = p.project_id;

-- 7. Find departments without employees.
SELECT
    d.department_id,
    d.department_name
FROM Departments d
LEFT JOIN Employees e
    ON d.department_id = e.department_id
WHERE e.employee_id IS NULL;

-- 8. Find projects without employees.
SELECT
    p.project_id,
    p.project_name
FROM Projects p
LEFT JOIN Employee_Projects ep
    ON p.project_id = ep.project_id
WHERE ep.employee_id IS NULL;

-- 9. Display each employee with their manager.
SELECT
    e.employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
    CONCAT(m.first_name, ' ', m.last_name) AS manager_name
FROM Employees e
LEFT JOIN Employees m
    ON e.manager_id = m.employee_id;

-- 10. Find employees working on more than one project.
SELECT
    e.employee_id,
    e.first_name,
    e.last_name,
    COUNT(ep.project_id) AS project_count
FROM Employees e
INNER JOIN Employee_Projects ep
    ON e.employee_id = ep.employee_id
GROUP BY e.employee_id, e.first_name, e.last_name
HAVING COUNT(ep.project_id) > 1;
