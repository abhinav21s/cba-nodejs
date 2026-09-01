const express = require("express");

const app = express();
const PORT = 3013;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let patients = [];
let services = [
  { id: 1, name: "Consultation", price: 500 },
  { id: 2, name: "Blood Test", price: 800 },
  { id: 3, name: "X-Ray", price: 1200 },
  { id: 4, name: "Medicine", price: 650 },
];
let invoices = [];
let nextPatientId = 1;
let nextInvoiceId = 1;

app.post("/patients", (req, res) => {
  const patient = { id: nextPatientId++, name: req.body.name, phone: req.body.phone || "" };
  patients.push(patient);
  res.status(201).json(patient);
});

app.get("/services", (req, res) => {
  res.json(services);
});

app.post("/invoices", (req, res) => {
  const { patientId, serviceIds, discountPercent, taxPercent } = req.body;
  const patient = patients.find((item) => item.id === Number(patientId));

  if (!patient || !Array.isArray(serviceIds)) {
    return res.status(400).json({ message: "valid patientId and serviceIds array are required" });
  }

  const selectedServices = services.filter((service) => serviceIds.includes(service.id));
  const subtotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const discount = subtotal * (Number(discountPercent || 0) / 100);
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * (Number(taxPercent || 0) / 100);
  const finalAmount = taxableAmount + tax;

  const invoice = {
    id: nextInvoiceId++,
    patient,
    services: selectedServices,
    subtotal,
    discount,
    tax,
    finalAmount,
    status: "Pending",
  };

  invoices.push(invoice);
  res.status(201).json(invoice);
});

app.patch("/invoices/:id/pay", (req, res) => {
  const invoice = invoices.find((item) => item.id === Number(req.params.id));

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  invoice.status = "Paid";
  res.json(invoice);
});

app.get("/invoices", (req, res) => {
  res.json(invoices);
});

app.listen(PORT, () => {
  console.log(`Medical Billing API running on http://localhost:${PORT}`);
});
