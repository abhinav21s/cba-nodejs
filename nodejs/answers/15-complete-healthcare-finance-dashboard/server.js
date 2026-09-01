const express = require("express");

const app = express();
const PORT = 3015;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let patients = [];
let doctors = [];
let appointments = [];
let bills = [];
let payments = [];
let nextPatientId = 1;
let nextDoctorId = 1;
let nextAppointmentId = 1;
let nextBillId = 1;
let nextPaymentId = 1;

app.post("/patients", (req, res) => {
  const patient = {
    id: nextPatientId++,
    name: req.body.name,
    phone: req.body.phone || "",
    medicalHistory: req.body.medicalHistory || [],
  };

  patients.push(patient);
  res.status(201).json(patient);
});

app.get("/patients", (req, res) => {
  const { search } = req.query;
  res.json(search ? patients.filter((patient) => patient.name.toLowerCase().includes(search.toLowerCase())) : patients);
});

app.post("/doctors", (req, res) => {
  const doctor = {
    id: nextDoctorId++,
    name: req.body.name,
    specialization: req.body.specialization,
    availableSlots: req.body.availableSlots || [],
  };

  doctors.push(doctor);
  res.status(201).json(doctor);
});

app.get("/doctors", (req, res) => {
  res.json(doctors);
});

app.post("/appointments", (req, res) => {
  const patient = patients.find((item) => item.id === Number(req.body.patientId));
  const doctor = doctors.find((item) => item.id === Number(req.body.doctorId));

  if (!patient || !doctor || !req.body.date || !req.body.time) {
    return res.status(400).json({ message: "valid patientId, doctorId, date, and time are required" });
  }

  const appointment = {
    id: nextAppointmentId++,
    patientId: patient.id,
    doctorId: doctor.id,
    date: req.body.date,
    time: req.body.time,
    status: "Booked",
    prescription: "",
  };

  appointments.push(appointment);
  res.status(201).json(appointment);
});

app.patch("/appointments/:id/cancel", (req, res) => {
  const appointment = appointments.find((item) => item.id === Number(req.params.id));

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  appointment.status = "Cancelled";
  res.json(appointment);
});

app.patch("/appointments/:id/prescription", (req, res) => {
  const appointment = appointments.find((item) => item.id === Number(req.params.id));

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  appointment.prescription = req.body.prescription || "";
  res.json(appointment);
});

app.post("/bills", (req, res) => {
  const { patientId, consultationFee, labCharges, medicineCharges } = req.body;
  const patient = patients.find((item) => item.id === Number(patientId));

  if (!patient) {
    return res.status(400).json({ message: "valid patientId is required" });
  }

  const bill = {
    id: nextBillId++,
    patientId: patient.id,
    consultationFee: Number(consultationFee || 0),
    labCharges: Number(labCharges || 0),
    medicineCharges: Number(medicineCharges || 0),
    status: "Pending",
  };

  bill.total = bill.consultationFee + bill.labCharges + bill.medicineCharges;
  bills.push(bill);
  res.status(201).json(bill);
});

app.post("/payments", (req, res) => {
  const bill = bills.find((item) => item.id === Number(req.body.billId));

  if (!bill) {
    return res.status(404).json({ message: "Bill not found" });
  }

  const payment = {
    id: nextPaymentId++,
    billId: bill.id,
    amount: Number(req.body.amount || bill.total),
    date: new Date().toISOString(),
  };

  payments.push(payment);
  bill.status = "Paid";
  res.status(201).json(payment);
});

app.get("/dashboard", (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const todaysAppointments = appointments.filter((appointment) => appointment.date === today);
  const todaysRevenue = payments
    .filter((payment) => payment.date.startsWith(today))
    .reduce((sum, payment) => sum + payment.amount, 0);

  res.json({
    totalPatients: patients.length,
    todaysAppointments: todaysAppointments.length,
    pendingBills: bills.filter((bill) => bill.status === "Pending").length,
    todaysRevenue,
  });
});

app.listen(PORT, () => {
  console.log(`Complete Healthcare Finance Dashboard API running on http://localhost:${PORT}`);
});
