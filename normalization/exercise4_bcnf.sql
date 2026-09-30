-- EXERCISE 4 — NORMALIZE UP TO BCNF
-- Scenario: University Course Scheduling
--
-- Relation:
-- Student_ID, Course_ID, Instructor, Instructor_Room
--
-- Functional dependencies:
--    (Student_ID, Course_ID) -> Instructor
--    Course_ID -> Instructor
--    Instructor -> Course_ID
--    Instructor -> Instructor_Room
--
-- 1. Candidate keys:
--    K1 = (Student_ID, Course_ID)
--    K2 = (Student_ID, Instructor)
--
--    Explanation:
--    Student_ID alone does not determine the other attributes.
--    Course_ID determines Instructor.
--    Instructor determines Course_ID and Instructor_Room.
--    Therefore either Student_ID + Course_ID or Student_ID + Instructor
--    determines the complete tuple.
--
-- 2. Is it in 3NF?
--    YES.
--    The dependency Instructor -> Course_ID has a determinant that is
--    not a superkey, but Course_ID is a prime attribute because it
--    belongs to candidate key (Student_ID, Course_ID).
--    The other non-trivial dependencies have similar 3NF justification.
--
-- 3. Is it in BCNF?
--    NO.
--
-- 4. BCNF violation:
--    Instructor -> Course_ID
--    Instructor is NOT a superkey of the original relation because
--    one instructor's course is shared by multiple students.
--
-- 5. BCNF decomposition:
--
--    INSTRUCTOR_COURSE(Instructor, Course_ID, Instructor_Room)
--    ENROLLMENT(Student_ID, Instructor)
--
--    In INSTRUCTOR_COURSE:
--       Instructor -> Course_ID, Instructor_Room
--       Instructor is the PK and therefore a superkey.
--
--    In ENROLLMENT:
--       (Student_ID, Instructor) is the PK.
--
-- 6. Primary/foreign keys:
--    INSTRUCTOR_COURSE.Instructor = PK
--    ENROLLMENT.(Student_ID, Instructor) = composite PK
--    ENROLLMENT.Instructor -> INSTRUCTOR_COURSE.Instructor = FK
--
--    Course_ID can be obtained from INSTRUCTOR_COURSE through Instructor.

DROP TABLE IF EXISTS ENROLLMENT_BCNF;
DROP TABLE IF EXISTS INSTRUCTOR_COURSE;

CREATE TABLE INSTRUCTOR_COURSE (
    Instructor      VARCHAR(10) PRIMARY KEY,
    Course_ID       VARCHAR(10) NOT NULL UNIQUE,
    Instructor_Room VARCHAR(10) NOT NULL
);

CREATE TABLE ENROLLMENT_BCNF (
    Student_ID VARCHAR(10) NOT NULL,
    Instructor VARCHAR(10) NOT NULL,
    PRIMARY KEY (Student_ID, Instructor),
    FOREIGN KEY (Instructor) REFERENCES INSTRUCTOR_COURSE(Instructor)
);

INSERT INTO INSTRUCTOR_COURSE VALUES
('I01', 'C01', 'R101'),
('I02', 'C02', 'R102');

INSERT INTO ENROLLMENT_BCNF VALUES
('S101', 'I01'),
('S102', 'I01'),
('S103', 'I02'),
('S104', 'I01'),
('S105', 'I01');

SELECT
    e.Student_ID,
    ic.Course_ID,
    e.Instructor,
    ic.Instructor_Room
FROM ENROLLMENT_BCNF e
JOIN INSTRUCTOR_COURSE ic
  ON e.Instructor = ic.Instructor
ORDER BY e.Student_ID;
