const express = require("express");

const app = express();
const PORT = 3005;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const doctors = [
  { id: 1, name: "Dr. Sharma", specialization: "General Physician" },
  { id: 2, name: "Dr. Mehta", specialization: "Cardiologist" },
  { id: 3, name: "Dr. Khan", specialization: "Dermatologist" },
];
let appointments = [];
let nextAppointmentId = 1;

app.get("/doctors", (req, res) => {
  res.json(doctors);
});

app.post("/appointments", (req, res) => {
  const { doctorId, date, time, patientName, patientPhone } = req.body;
  const doctor = doctors.find((item) => item.id === Number(doctorId));

  if (!doctor || !date || !time || !patientName) {
    return res.status(400).json({ message: "valid doctorId, date, time, and patientName are required" });
  }

  const appointment = {
    id: nextAppointmentId++,
    doctor,
    date,
    time,
    patientName,
    patientPhone: patientPhone || "",
    status: "Booked",
  };

  appointments.push(appointment);
  res.status(201).json(appointment);
});

app.get("/appointments", (req, res) => {
  res.json(appointments.filter((appointment) => appointment.status === "Booked"));
});

app.patch("/appointments/:id/cancel", (req, res) => {
  const appointment = appointments.find((item) => item.id === Number(req.params.id));

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  appointment.status = "Cancelled";
  res.json(appointment);
});

app.listen(PORT, () => {
  console.log(`Doctor Appointment API running on http://localhost:${PORT}`);
});
