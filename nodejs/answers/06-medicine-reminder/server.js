const express = require("express");

const app = express();
const PORT = 3006;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let medicines = [];
let nextId = 1;

app.post("/medicines", (req, res) => {
  const { name, dosage, startDate, endDate, time, frequency } = req.body;

  if (!name || !dosage || !startDate || !endDate || !time || !frequency) {
    return res.status(400).json({ message: "name, dosage, startDate, endDate, time, and frequency are required" });
  }

  const medicine = {
    id: nextId++,
    name,
    dosage,
    startDate,
    endDate,
    time,
    frequency,
    taken: false,
  };

  medicines.push(medicine);
  res.status(201).json(medicine);
});

app.get("/schedule", (req, res) => {
  const schedule = medicines
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((medicine) => ({
      time: medicine.time,
      medicine: medicine.name,
      dosage: medicine.dosage,
      taken: medicine.taken,
    }));

  res.json(schedule);
});

app.patch("/medicines/:id/taken", (req, res) => {
  const medicine = medicines.find((item) => item.id === Number(req.params.id));

  if (!medicine) {
    return res.status(404).json({ message: "Medicine not found" });
  }

  medicine.taken = true;
  res.json(medicine);
});

app.listen(PORT, () => {
  console.log(`Medicine Reminder API running on http://localhost:${PORT}`);
});
