-- EXERCISE 3 — CONVERT 2NF TO 3NF
-- Scenario: Employee Department
--
-- Primary key:
--    Employee_ID
--
-- Functional dependencies:
--    Employee_ID -> Employee_Name, Dept_ID
--    Dept_ID -> Dept_Name, Dept_Location, Manager_ID
--    Manager_ID -> Manager_Name
--
-- 1. Is the table in 2NF?
--    YES.
--    The primary key is a single attribute (Employee_ID), so a partial
--    dependency on part of a composite key is impossible.
--
-- 2. Transitive dependencies:
--    Employee_ID -> Dept_ID -> Dept_Name
--    Employee_ID -> Dept_ID -> Dept_Location
--    Employee_ID -> Dept_ID -> Manager_ID
--    Employee_ID -> Dept_ID -> Manager_ID -> Manager_Name
--
-- 3. Why does it violate 3NF?
--    Non-key attributes depend on other non-key attributes:
--       Dept_ID -> Dept_Name, Dept_Location, Manager_ID
--       Manager_ID -> Manager_Name
--    Therefore there are transitive dependencies.
--
-- 4. 3NF decomposition:
--    EMPLOYEE(Employee_ID, Employee_Name, Dept_ID)
--    DEPARTMENT(Dept_ID, Dept_Name, Dept_Location, Manager_ID)
--    MANAGER(Manager_ID, Manager_Name)
--
-- 5. Keys:
--    EMPLOYEE.Employee_ID = PK
--    EMPLOYEE.Dept_ID -> DEPARTMENT.Dept_ID = FK
--    DEPARTMENT.Dept_ID = PK
--    DEPARTMENT.Manager_ID -> MANAGER.Manager_ID = FK
--    MANAGER.Manager_ID = PK

DROP TABLE IF EXISTS EMPLOYEE;
DROP TABLE IF EXISTS DEPARTMENT;
DROP TABLE IF EXISTS MANAGER;

CREATE TABLE MANAGER (
    Manager_ID   VARCHAR(10) PRIMARY KEY,
    Manager_Name VARCHAR(50) NOT NULL
);

CREATE TABLE DEPARTMENT (
    Dept_ID       VARCHAR(10) PRIMARY KEY,
    Dept_Name     VARCHAR(50) NOT NULL,
    Dept_Location VARCHAR(100) NOT NULL,
    Manager_ID    VARCHAR(10) NOT NULL,
    FOREIGN KEY (Manager_ID) REFERENCES MANAGER(Manager_ID)
);

CREATE TABLE EMPLOYEE (
    Employee_ID   VARCHAR(10) PRIMARY KEY,
    Employee_Name VARCHAR(50) NOT NULL,
    Dept_ID       VARCHAR(10) NOT NULL,
    FOREIGN KEY (Dept_ID) REFERENCES DEPARTMENT(Dept_ID)
);

INSERT INTO MANAGER VALUES
('M01', 'Sharma'),
('M02', 'Rao');

INSERT INTO DEPARTMENT VALUES
('D01', 'IT', 'Hyderabad', 'M01'),
('D02', 'HR', 'Mumbai', 'M02');

INSERT INTO EMPLOYEE VALUES
('E101', 'Rahul', 'D01'),
('E102', 'Priya', 'D01'),
('E103', 'Amit', 'D02'),
('E104', 'Sneha', 'D02');

SELECT * FROM MANAGER;
SELECT * FROM DEPARTMENT;
SELECT * FROM EMPLOYEE;
