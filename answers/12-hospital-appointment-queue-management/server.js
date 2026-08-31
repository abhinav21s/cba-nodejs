const express = require("express");

const app = express();
const PORT = 3012;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let doctors = [
  { id: 1, name: "Dr. Rao", specialization: "ENT", availableSlots: ["10:00", "11:00", "12:00"] },
  { id: 2, name: "Dr. Iyer", specialization: "Orthopedic", availableSlots: ["14:00", "15:00"] },
];
let appointments = [];
let queue = [];
let nextAppointmentId = 1;
let nextToken = 1;

app.get("/doctors", (req, res) => {
  res.json(doctors);
});

app.post("/appointments", (req, res) => {
  const { doctorId, patientName, date, time } = req.body;
  const doctor = doctors.find((item) => item.id === Number(doctorId));

  if (!doctor || !patientName || !date || !time) {
    return res.status(400).json({ message: "valid doctorId, patientName, date, and time are required" });
  }

  const appointment = {
    id: nextAppointmentId++,
    doctorId: doctor.id,
    patientName,
    date,
    time,
    status: "Confirmed",
    token: null,
  };

  appointments.push(appointment);
  res.status(201).json(appointment);
});

app.patch("/appointments/:id/arrive", (req, res) => {
  const appointment = appointments.find((item) => item.id === Number(req.params.id));

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  appointment.status = "Arrived";
  appointment.token = nextToken++;
  queue.push(appointment);
  res.json(appointment);
});

app.get("/queue", (req, res) => {
  res.json(queue.filter((appointment) => appointment.status === "Arrived"));
});

app.patch("/doctors/:id/call-next", (req, res) => {
  const nextPatient = queue.find((appointment) => appointment.doctorId === Number(req.params.id) && appointment.status === "Arrived");

  if (!nextPatient) {
    return res.status(404).json({ message: "No patient waiting for this doctor" });
  }

  nextPatient.status = "Completed";
  res.json(nextPatient);
});

app.get("/dashboard", (req, res) => {
  res.json({
    dailyAppointmentCount: appointments.length,
    waiting: queue.filter((appointment) => appointment.status === "Arrived").length,
    completed: appointments.filter((appointment) => appointment.status === "Completed").length,
    cancelled: appointments.filter((appointment) => appointment.status === "Cancelled").length,
  });
});

app.listen(PORT, () => {
  console.log(`Hospital Queue API running on http://localhost:${PORT}`);
});
