const express = require("express");

const app = express();
const PORT = 3004;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let patients = [];
let nextId = 1;

app.post("/patients", (req, res) => {
  const { name, age, gender, phone, address, bloodGroup, symptoms } = req.body;

  if (!name || !age || !phone) {
    return res.status(400).json({ message: "name, age, and phone are required" });
  }

  const patient = {
    id: nextId++,
    name,
    age: Number(age),
    gender: gender || "",
    phone,
    address: address || "",
    bloodGroup: bloodGroup || "",
    symptoms: symptoms || "",
  };

  patients.push(patient);
  res.status(201).json(patient);
});

app.get("/patients", (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.json(patients);
  }

  const text = search.toLowerCase();
  res.json(
    patients.filter((patient) =>
      patient.name.toLowerCase().includes(text) ||
      patient.phone.includes(search) ||
      patient.symptoms.toLowerCase().includes(text)
    )
  );
});

app.put("/patients/:id", (req, res) => {
  const patient = patients.find((item) => item.id === Number(req.params.id));

  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  Object.assign(patient, req.body);
  if (patient.age !== undefined) patient.age = Number(patient.age);
  res.json(patient);
});

app.delete("/patients/:id", (req, res) => {
  const beforeDelete = patients.length;
  patients = patients.filter((patient) => patient.id !== Number(req.params.id));

  if (patients.length === beforeDelete) {
    return res.status(404).json({ message: "Patient not found" });
  }

  res.json({ message: "Patient deleted" });
});

app.listen(PORT, () => {
  console.log(`Patient Registration API running on http://localhost:${PORT}`);
});
