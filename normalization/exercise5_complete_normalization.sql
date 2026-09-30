-- EXERCISE 5 — COMPLETE NORMALIZATION
-- UNF -> 1NF -> 2NF -> 3NF -> BCNF
-- Scenario: Hospital Appointment System
--
-- Important assumption:
-- The source data does not provide Treatment_ID values or Appointment_ID
-- values. We create surrogate IDs for the normalized design:
--    A001, A002, A003, A004 for appointments
--    T001 ECG
--    T002 Blood Test
--    T003 MRI
--    T004 CT Scan
--
-- ============================================================
-- PART A — UNF
-- ============================================================
--
-- Repeating group:
--    Treatments
--
-- Examples:
--    P101 / A001 -> ECG, Blood Test
--    P101 / A003 -> MRI, CT Scan
--
-- The original table is NOT in 1NF because Treatments can contain
-- multiple values in one cell.
--
-- ============================================================
-- PART B — 1NF
-- ============================================================
--
-- Make each treatment a separate row.
--
-- A suitable key for appointment/treatment records is:
--    (Appointment_ID, Treatment_ID)
--
-- Appointment_ID identifies an appointment, while Treatment_ID
-- identifies a treatment associated with that appointment.
--
-- ============================================================
-- PART C — 2NF
-- ============================================================
--
-- With the composite key (Appointment_ID, Treatment_ID), attributes
-- such as Patient_ID, Doctor_ID and Appointment_Date depend only on
-- Appointment_ID, not on the complete composite key.
--
-- Treatment_Name depends only on Treatment_ID.
--
-- These are partial dependencies.
--
-- Therefore split into:
--    APPOINTMENT
--    TREATMENT
--    APPOINTMENT_TREATMENT
--
-- Also, Patient_Name depends on Patient_ID and doctor details depend
-- on Doctor_ID, so those details should not be repeated in the
-- appointment table.
--
-- ============================================================
-- PART D — 3NF
-- ============================================================
--
-- Functional dependencies:
--    Patient_ID -> Patient_Name
--    Doctor_ID -> Doctor_Name, Specialization, Room
--    Appointment_ID -> Patient_ID, Doctor_ID, Appointment_Date
--    Treatment_ID -> Treatment_Name
--    (Appointment_ID, Treatment_ID) -> complete junction-row data
--
-- Doctor_ID -> Specialization and Doctor_ID -> Room are not kept as
-- repeated attributes in APPOINTMENT. They belong in DOCTOR.
--
-- Final 3NF relations:
--    PATIENT
--    DOCTOR
--    APPOINTMENT
--    TREATMENT
--    APPOINTMENT_TREATMENT
--
-- ============================================================
-- PART E — BCNF CHECK
-- ============================================================
--
-- PATIENT
--    FD: Patient_ID -> Patient_Name
--    Candidate key: Patient_ID
--    Determinant is a superkey.
--    => BCNF
--
-- DOCTOR
--    FD: Doctor_ID -> Doctor_Name, Specialization, Room
--    Candidate key: Doctor_ID
--    Determinant is a superkey.
--    => BCNF
--
-- APPOINTMENT
--    FD: Appointment_ID -> Patient_ID, Doctor_ID, Appointment_Date
--    Candidate key: Appointment_ID
--    Determinant is a superkey.
--    => BCNF
--
-- TREATMENT
--    FD: Treatment_ID -> Treatment_Name
--    Candidate key: Treatment_ID
--    Determinant is a superkey.
--    => BCNF
--
-- APPOINTMENT_TREATMENT
--    FD: (Appointment_ID, Treatment_ID) -> all attributes
--    Candidate key: (Appointment_ID, Treatment_ID)
--    Determinant is a superkey.
--    => BCNF
--
-- Therefore the final design satisfies BCNF.

DROP TABLE IF EXISTS APPOINTMENT_TREATMENT;
DROP TABLE IF EXISTS APPOINTMENT;
DROP TABLE IF EXISTS TREATMENT;
DROP TABLE IF EXISTS DOCTOR;
DROP TABLE IF EXISTS PATIENT;

-- ============================================================
-- FINAL BCNF DESIGN
-- ============================================================

CREATE TABLE PATIENT (
    Patient_ID   VARCHAR(10) PRIMARY KEY,
    Patient_Name VARCHAR(50) NOT NULL
);

CREATE TABLE DOCTOR (
    Doctor_ID      VARCHAR(10) PRIMARY KEY,
    Doctor_Name    VARCHAR(50) NOT NULL,
    Specialization VARCHAR(100) NOT NULL,
    Room           VARCHAR(10) NOT NULL
);

CREATE TABLE APPOINTMENT (
    Appointment_ID   VARCHAR(10) PRIMARY KEY,
    Patient_ID       VARCHAR(10) NOT NULL,
    Doctor_ID        VARCHAR(10) NOT NULL,
    Appointment_Date DATE NOT NULL,
    FOREIGN KEY (Patient_ID) REFERENCES PATIENT(Patient_ID),
    FOREIGN KEY (Doctor_ID) REFERENCES DOCTOR(Doctor_ID)
);

CREATE TABLE TREATMENT (
    Treatment_ID   VARCHAR(10) PRIMARY KEY,
    Treatment_Name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE APPOINTMENT_TREATMENT (
    Appointment_ID VARCHAR(10) NOT NULL,
    Treatment_ID   VARCHAR(10) NOT NULL,
    PRIMARY KEY (Appointment_ID, Treatment_ID),
    FOREIGN KEY (Appointment_ID) REFERENCES APPOINTMENT(Appointment_ID),
    FOREIGN KEY (Treatment_ID) REFERENCES TREATMENT(Treatment_ID)
);

-- ============================================================
-- SAMPLE DATA FROM THE QUESTION
-- ============================================================

INSERT INTO PATIENT VALUES
('P101', 'Rahul'),
('P102', 'Priya'),
('P103', 'Amit');

INSERT INTO DOCTOR VALUES
('D01', 'Sharma', 'Cardiology', 'R101'),
('D02', 'Rao', 'Neurology', 'R102');

INSERT INTO APPOINTMENT VALUES
('A001', 'P101', 'D01', '2026-09-01'),
('A002', 'P102', 'D02', '2026-09-02'),
('A003', 'P101', 'D02', '2026-09-10'),
('A004', 'P103', 'D01', '2026-09-11');

INSERT INTO TREATMENT VALUES
('T001', 'ECG'),
('T002', 'Blood Test'),
('T003', 'MRI'),
('T004', 'CT Scan');

INSERT INTO APPOINTMENT_TREATMENT VALUES
('A001', 'T001'),
('A001', 'T002'),
('A002', 'T003'),
('A003', 'T003'),
('A003', 'T004'),
('A004', 'T001');

-- View the final normalized appointment information
SELECT
    a.Appointment_ID,
    p.Patient_ID,
    p.Patient_Name,
    d.Doctor_ID,
    d.Doctor_Name,
    d.Specialization,
    d.Room,
    a.Appointment_Date,
    t.Treatment_ID,
    t.Treatment_Name
FROM APPOINTMENT a
JOIN PATIENT p
    ON a.Patient_ID = p.Patient_ID
JOIN DOCTOR d
    ON a.Doctor_ID = d.Doctor_ID
JOIN APPOINTMENT_TREATMENT at
    ON a.Appointment_ID = at.Appointment_ID
JOIN TREATMENT t
    ON at.Treatment_ID = t.Treatment_ID
ORDER BY a.Appointment_ID, t.Treatment_ID;
