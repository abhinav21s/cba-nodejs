-- B1
INSERT INTO departments VALUES(001,'SALES','BENGALURU'),
('ENGINEERING','HYDERABAD'),
('HR','GURUGRAM');

-- employee INSERTION
INSERT INTO employees VALUES(001,'SAM','HARMAN','ABC@mail',200000,'2020-03-01',001,NULL),
VALUES(002,'JASON','SMITH','jason@mail','250000','2019-08-01',002,NULL),
VALUES(003,'TIM','PAYNE','tim@mail.com','200000','2026-03001',002,002),
VALUES(004,'LEWIS','DAVIS','lewis@mail.com',200000,'2023-03-01',001,001),
VALUES(005,'CASSIDY','FINCH','cassidy@mail.com',250000,'2022-08-01',003,NULL);

-- B2

INSERT INTO customers VALUES(001,'Praveen','praveen@mail.com','chennai','India'),
VALUES(002,'Devon','devon@mail.com','Indiana','USA'),
VALUES(003,'Axl','axl@mail.com','Iowa','USA');

INSERT INTO orders VALUES(001,001,'2026-05-01',2000.00),
VALUES(002,001,'2026-04-22',200.02),
VALUES(003,003,'2026-03-21',2300.02),
VALUES(004,002,'2026-02-12',250.00);

-- B3
UPDATE employees 
set salary=(0.1*salary)+salary
where dept_id =(
    select dept_id 
    from departments
    where dept_name="ENGINEERING"
);


-- B4
DELETE FROM employees 
where dept_id is NULL;

-- B5 
SELECT first_name,last_name,salary
FROM employee 
where salary>50000;

-- B6 
SELECT * 
FROM customers 
where name LIKE 'A%'
ORDER BY name
LIMIT 5

-- B6 (Basic) — Pattern matching & LIMIT
SELECT *
FROM customers
WHERE name LIKE 'A%'
ORDER BY name
LIMIT 5;

-- B7 (Intermediate) — Aggregate functions
SELECT dept_id, AVG(salary) AS average_salary, COUNT(*) AS employee_count
FROM employees
GROUP BY dept_id;

-- B8 (Intermediate) — HAVING clause
SELECT d.dept_name, COUNT(e.emp_id) AS employee_count
FROM departments d
INNER JOIN employees e ON d.dept_id = e.dept_id
GROUP BY d.dept_id, d.dept_name
HAVING COUNT(e.emp_id) > 3;

-- B9 (Intermediate) — INNER JOIN
SELECT CONCAT(e.first_name, ' ', e.last_name) AS full_name,
       d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;

-- B10 (Intermediate) — LEFT JOIN
SELECT d.dept_name, COUNT(e.emp_id) AS employee_count
FROM departments d
LEFT JOIN employees e ON d.dept_id = e.dept_id
GROUP BY d.dept_id, d.dept_name;

-- B11 (Intermediate) — Subquery
SELECT first_name, last_name
FROM employees
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
);

-- B12 (Intermediate) — CASE + date functions
SELECT
    CONCAT(first_name, ' ', last_name) AS name,
    CASE
        WHEN hire_date < DATE_SUB(CURRENT_DATE, INTERVAL 5 YEAR)
            THEN 'Veteran'
        WHEN hire_date <= DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)
            THEN 'Established'
        ELSE 'New'
    END AS tenure_level,
    TIMESTAMPDIFF(YEAR, hire_date, CURRENT_DATE) AS years_worked
FROM employees;

