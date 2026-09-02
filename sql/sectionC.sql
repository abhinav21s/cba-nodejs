
-- C1 (Basic) — Create a user
CREATE USER 'hr_user'@'localhost'
IDENTIFIED BY 'HrPass123!';

-- C2 (Basic) — Grant read-only access
GRANT SELECT ON company_db.employees
TO 'hr_user'@'localhost';

GRANT SELECT ON company_db.departments
TO 'hr_user'@'localhost';

-- C3 (Intermediate) — Grant broader privileges to a manager account
CREATE USER 'dept_manager'@'localhost'
IDENTIFIED BY 'DeptPass123!';

GRANT SELECT, INSERT, UPDATE
ON company_db.*
TO 'dept_manager'@'localhost';

-- C4 (Intermediate) — Revoke privileges
REVOKE UPDATE
ON company_db.employees
FROM 'dept_manager'@'localhost';

-- C5 (Intermediate) — Roles & review
CREATE ROLE 'read_only_role';

GRANT SELECT
ON company_db.*
TO 'read_only_role';

CREATE USER 'auditor'@'localhost'
IDENTIFIED BY 'AuditorPass123!';

GRANT 'read_only_role'
TO 'auditor'@'localhost';

SHOW GRANTS FOR 'hr_user'@'localhost';

FLUSH PRIVILEGES;
