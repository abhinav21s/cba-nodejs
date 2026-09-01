-- A1: Create the database

CREATE DATABASE company_db;

-- Select the database for use

USE company_db;


-- A2: Create departments table

CREATE TABLE departments (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(50) NOT NULL UNIQUE,
    location VARCHAR(50)
);


-- A3: Create employees

CREATE TABLE employees (
    emp_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    salary DECIMAL(10,2) NOT NULL CHECK (salary > 0),
    hire_date DATE DEFAULT (CURRENT_DATE),
    dept_id INT,
    manager_id INT,
    
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id),
    FOREIGN KEY (manager_id) REFERENCES employees(emp_id)
);


-- A4: Create projects

CREATE TABLE projects (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(100) NOT NULL,
    dept_id INT,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);


-- A4: Create employee_projects junction table

CREATE TABLE employee_projects (
    emp_id INT,
    project_id INT,
    role VARCHAR(50),
    hours_worked DECIMAL(8,2) DEFAULT 0,
    
    PRIMARY KEY (emp_id, project_id),
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);


-- A5: Create customers

CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    city VARCHAR(50),
    country VARCHAR(50)
);


-- A5: Create orders

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    order_date DATE,
    total_amount DECIMAL(12,2),
    
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);


-- A6.1: Add phone column

ALTER TABLE employees
ADD COLUMN phone VARCHAR(15);


-- A6.2: Change salary default to 30000.00

ALTER TABLE employees
ALTER COLUMN salary SET DEFAULT 30000.00;


-- A6.3: Rename phone to phone_number

ALTER TABLE employees
RENAME COLUMN phone TO phone_number;


-- A7.1: Create index on last_name

CREATE INDEX idx_lastname
ON employees(last_name);


-- A7.2: Add CHECK constraint to orders

ALTER TABLE orders
ADD CONSTRAINT chk_total_amount
CHECK (total_amount >= 0);


-- A7.3: Drop the index

DROP INDEX idx_lastname ON employees;


-- A8.1: Create temporary/throwaway table

CREATE TABLE temp_logs (
    log_id INT,
    message VARCHAR(100)
);


-- A8.2: Insert 2 rows

INSERT INTO temp_logs (log_id, message)
VALUES
    (1, 'First log'),
    (2, 'Second log');


-- A8.3: TRUNCATE and DROP

-- TRUNCATE removes all rows but keeps the table structure.
-- DROP TABLE removes the table itself, including its structure and data.

TRUNCATE TABLE temp_logs;

DROP TABLE temp_logs;