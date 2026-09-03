-- SECTION G — INDEXING
-- Existing examples

-- 24. Create an index on employee email
CREATE INDEX idx_employee_email
ON Employees(email);

-- Useful query
SELECT *
FROM Employees
WHERE email = 'john@company.com';

-- 25. Create a composite index
CREATE INDEX idx_department_salary
ON Employees(department_id, salary);

-- Query that may benefit from the composite index
SELECT *
FROM Employees
WHERE department_id = 1
  AND salary > 60000;


-- PRACTICE ANSWERS — INDEXING

-- 16. Create an index on department_id.
CREATE INDEX idx_employee_department
ON Employees(department_id);

-- 17. Explain why indexes improve SELECT performance.
-- Indexes provide a faster lookup structure for indexed columns, reducing
-- the amount of table data the database may need to scan for many queries.
-- The trade-off is extra storage and additional work for INSERT, UPDATE,
-- and DELETE operations.

-- 18. Identify columns that should not always be indexed.
-- Columns with very low cardinality (for example, a column containing only
-- a few repeated values), columns that are rarely used in WHERE/JOIN/ORDER
-- BY conditions, and columns in very small tables are often poor candidates.
-- Indexing every column can also increase storage and write overhead.

-- 19. Compare single-column and composite indexes.
-- Single-column index:
--   CREATE INDEX idx_department ON Employees(department_id);
--   Useful when queries commonly filter/order by department_id.
--
-- Composite index:
--   CREATE INDEX idx_department_salary
--   ON Employees(department_id, salary);
--   Useful for queries involving both columns, especially when department_id
--   is the leading column. Column order matters.

-- 20. Test query performance before and after creating an index.
-- MySQL example:
EXPLAIN
SELECT *
FROM Employees
WHERE department_id = 1;

CREATE INDEX idx_department_test
ON Employees(department_id);

EXPLAIN
SELECT *
FROM Employees
WHERE department_id = 1;

-- On this very small sample table, the optimizer may still choose a table
-- scan because the table is tiny. Index benefits are easier to observe on
-- larger datasets.
