SQL NORMALIZATION ASSIGNMENT — ANSWERS
==========================================

This ZIP contains one separate SQL file for each exercise.

Files
-----
1. exercise1_unf_to_1nf.sql
   UNF -> 1NF, atomic values, composite primary key.

2. exercise2_1nf_to_2nf.sql
   Candidate key, partial dependencies, 2NF decomposition,
   primary keys and foreign keys.

3. exercise3_2nf_to_3nf.sql
   2NF check, transitive dependencies, 3NF decomposition,
   primary keys and foreign keys.

4. exercise4_bcnf.sql
   Candidate keys, 3NF check, BCNF violation, and BCNF decomposition.

5. exercise5_complete_normalization.sql
   Complete UNF -> 1NF -> 2NF -> 3NF -> BCNF analysis,
   final schema, keys, foreign keys, and sample data.

Notes
-----
- The SQL uses common SQL syntax compatible with MySQL/PostgreSQL
  with only minor differences if a particular DBMS requires them.
- Exercise 5 creates Appointment_ID and Treatment_ID because the
  original question gives no IDs for those entities.
- Exercise 4 uses the BCNF decomposition:
      INSTRUCTOR_COURSE(Instructor, Course_ID, Instructor_Room)
      ENROLLMENT_BCNF(Student_ID, Instructor)
  The original Course_ID can be recovered through the instructor.
