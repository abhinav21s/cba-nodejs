const express = require("express");

const app = express();
const PORT = 3011;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let patients = [];
let nextPatientId = 1;
let nextVisitId = 1;

app.post("/patients", (req, res) => {
  const { name, age, phone, allergies, medicalHistory } = req.body;

  if (!name || !age || !phone) {
    return res.status(400).json({ message: "name, age, and phone are required" });
  }

  const patient = {
    id: nextPatientId++,
    name,
    age: Number(age),
    phone,
    allergies: allergies || [],
    medicalHistory: medicalHistory || [],
    visits: [],
  };

  patients.push(patient);
  res.status(201).json(patient);
});

app.get("/patients", (req, res) => {
  const { search } = req.query;
  const result = search
    ? patients.filter((patient) => patient.name.toLowerCase().includes(search.toLowerCase()) || patient.phone.includes(search))
    : patients;

  res.json(result);
});

app.post("/patients/:id/history", (req, res) => {
  const patient = patients.find((item) => item.id === Number(req.params.id));

  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  patient.medicalHistory.push(req.body);
  res.status(201).json(patient);
});

app.post("/patients/:id/visits", (req, res) => {
  const patient = patients.find((item) => item.id === Number(req.params.id));

  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  const visit = {
    id: nextVisitId++,
    date: req.body.date,
    symptoms: req.body.symptoms || "",
    prescription: req.body.prescription || "",
    doctorNotes: req.body.doctorNotes || "",
  };

  patient.visits.push(visit);
  res.status(201).json(visit);
});

app.get("/doctor-dashboard", (req, res) => {
  res.json({
    totalPatients: patients.length,
    totalVisits: patients.reduce((sum, patient) => sum + patient.visits.length, 0),
    patients,
  });
});

app.listen(PORT, () => {
  console.log(`Medical Patient Records API running on http://localhost:${PORT}`);
});
