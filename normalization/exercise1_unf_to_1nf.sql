-- EXERCISE 1 — CONVERT UNF TO 1NF
-- Scenario: Student Courses
--
-- 1. Why is the original table NOT in 1NF?
--    The Courses column contains multiple values in a single cell
--    (for example: "DBMS, Java, Python"). Therefore the values are
--    not atomic and there is a repeating group.
--
-- 2. 1NF conversion:
--    Every row contains exactly one student-course combination.
--
-- 3. Every cell now contains one atomic value.
--
-- 4. Primary key:
--    PRIMARY KEY (Student_ID, Course)
--    A student can enroll in many courses, and a course can have
--    many students, so neither column alone uniquely identifies a row.

DROP TABLE IF EXISTS STUDENT_COURSE_1NF;

CREATE TABLE STUDENT_COURSE_1NF (
    Student_ID   VARCHAR(10) NOT NULL,
    Student_Name VARCHAR(50) NOT NULL,
    Course       VARCHAR(50) NOT NULL,
    PRIMARY KEY (Student_ID, Course)
);

INSERT INTO STUDENT_COURSE_1NF (Student_ID, Student_Name, Course) VALUES
('S101', 'Rahul', 'DBMS'),
('S101', 'Rahul', 'Java'),
('S101', 'Rahul', 'Python'),
('S102', 'Priya', 'DBMS'),
('S102', 'Priya', 'Python'),
('S103', 'Amit', 'Java'),
('S103', 'Amit', 'C#');

-- Final 1NF structure:
-- Student_ID | Student_Name | Course
-- S101       | Rahul        | DBMS
-- S101       | Rahul        | Java
-- S101       | Rahul        | Python
-- S102       | Priya        | DBMS
-- S102       | Priya        | Python
-- S103       | Amit         | Java
-- S103       | Amit         | C#

SELECT * FROM STUDENT_COURSE_1NF;
