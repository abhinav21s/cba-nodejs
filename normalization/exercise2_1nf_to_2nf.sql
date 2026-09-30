-- EXERCISE 2 — CONVERT 1NF TO 2NF
-- Scenario: Student Enrollment
--
-- Given primary key:
--    (Student_ID, Course_ID)
--
-- Functional dependencies:
--    Student_ID -> Student_Name
--    Course_ID -> Course_Name, Instructor
--    (Student_ID, Course_ID) -> Grade
--
-- 1. Candidate key:
--    (Student_ID, Course_ID)
--
-- 2. Partial dependencies:
--    Student_ID -> Student_Name
--    Course_ID -> Course_Name, Instructor
--
--    These are partial because Student_Name depends only on Student_ID,
--    while Course_Name and Instructor depend only on Course_ID.
--
-- 3. Why not 2NF?
--    The relation is in 1NF, but non-key attributes depend on only
--    part of the composite primary key. Therefore it violates 2NF.
--
-- 4. Decomposition into 2NF:
--    STUDENT, COURSE, and ENROLLMENT.
--
-- 5. Keys:
--    STUDENT: Student_ID = PK
--    COURSE: Course_ID = PK
--    ENROLLMENT: (Student_ID, Course_ID) = composite PK
--    ENROLLMENT.Student_ID -> STUDENT.Student_ID = FK
--    ENROLLMENT.Course_ID  -> COURSE.Course_ID  = FK

DROP TABLE IF EXISTS ENROLLMENT;
DROP TABLE IF EXISTS COURSE;
DROP TABLE IF EXISTS STUDENT;

CREATE TABLE STUDENT (
    Student_ID   VARCHAR(10) PRIMARY KEY,
    Student_Name VARCHAR(50) NOT NULL
);

CREATE TABLE COURSE (
    Course_ID   VARCHAR(10) PRIMARY KEY,
    Course_Name VARCHAR(50) NOT NULL,
    Instructor  VARCHAR(50) NOT NULL
);

CREATE TABLE ENROLLMENT (
    Student_ID VARCHAR(10) NOT NULL,
    Course_ID  VARCHAR(10) NOT NULL,
    Grade      VARCHAR(5),
    PRIMARY KEY (Student_ID, Course_ID),
    FOREIGN KEY (Student_ID) REFERENCES STUDENT(Student_ID),
    FOREIGN KEY (Course_ID) REFERENCES COURSE(Course_ID)
);

INSERT INTO STUDENT VALUES
('S101', 'Rahul'),
('S102', 'Priya'),
('S103', 'Amit');

INSERT INTO COURSE VALUES
('C01', 'DBMS', 'Sharma'),
('C02', 'Java', 'Rao'),
('C03', 'Python', 'Khan');

INSERT INTO ENROLLMENT VALUES
('S101', 'C01', 'A'),
('S101', 'C02', 'B'),
('S102', 'C01', 'A'),
('S102', 'C03', 'A'),
('S103', 'C02', 'B');

SELECT * FROM STUDENT;
SELECT * FROM COURSE;
SELECT * FROM ENROLLMENT;
