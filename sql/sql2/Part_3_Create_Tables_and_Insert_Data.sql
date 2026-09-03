-- PART 3 — CREATE TABLES AND INSERT SAMPLE DATA

CREATE TABLE Departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);

CREATE TABLE Employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    salary DECIMAL(10,2),
    hire_date DATE,
    department_id INT,
    manager_id INT,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id),
    FOREIGN KEY (manager_id) REFERENCES Employees(employee_id)
);

CREATE TABLE Projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(100),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

CREATE TABLE Employee_Projects (
    employee_id INT,
    project_id INT,
    assigned_date DATE,
    role VARCHAR(100),
    PRIMARY KEY (employee_id, project_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id)
);

-- Departments
INSERT INTO Departments VALUES
(1, 'IT', 'Hyderabad'),
(2, 'HR', 'Mumbai'),
(3, 'Finance', 'Delhi'),
(4, 'Sales', 'Bangalore'),
(5, 'Marketing', 'Pune');

-- Managers first
INSERT INTO Employees VALUES
(101, 'John', 'Smith', 'john@company.com', 90000, '2020-01-10', 1, NULL),
(102, 'Sarah', 'Johnson', 'sarah@company.com', 85000, '2019-03-15', 2, NULL),
(103, 'Michael', 'Brown', 'michael@company.com', 95000, '2018-06-20', 3, NULL);

-- Other employees
INSERT INTO Employees VALUES
(104, 'David', 'Wilson', 'david@company.com', 60000, '2022-02-10', 1, 101),
(105, 'Emma', 'Davis', 'emma@company.com', 65000, '2021-05-15', 1, 101),
(106, 'James', 'Miller', 'james@company.com', 55000, '2023-01-20', 2, 102),
(107, 'Olivia', 'Taylor', 'olivia@company.com', 70000, '2020-08-25', 3, 103),
(108, 'Robert', 'Anderson', 'robert@company.com', 58000, '2022-09-10', 4, NULL),
(109, 'Sophia', 'Thomas', 'sophia@company.com', 62000, '2021-11-12', 4, 108),
(110, 'Daniel', 'Jackson', 'daniel@company.com', 50000, '2023-04-18', 5, NULL);

-- Projects
INSERT INTO Projects VALUES
(201, 'Banking Application', '2024-01-01', '2024-12-31', 500000, 1),
(202, 'HR Management System', '2024-02-01', '2024-10-30', 300000, 2),
(203, 'Financial Analytics', '2024-03-01', '2025-03-01', 700000, 3),
(204, 'Sales Dashboard', '2024-04-01', '2024-11-01', 250000, 4);

-- Employee Projects
INSERT INTO Employee_Projects VALUES
(104, 201, '2024-01-05', 'Developer'),
(105, 201, '2024-01-10', 'Tester'),
(106, 202, '2024-02-05', 'HR Analyst'),
(107, 203, '2024-03-05', 'Data Analyst'),
(108, 204, '2024-04-05', 'Project Manager'),
(109, 204, '2024-04-10', 'Sales Analyst');
