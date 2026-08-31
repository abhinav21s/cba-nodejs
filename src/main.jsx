import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Banknote,
  BriefcaseMedical,
  CalendarClock,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Landmark,
  LayoutDashboard,
  LineChart,
  Pill,
  ReceiptText,
  Search,
  ShieldCheck,
  Stethoscope,
  WalletCards,
} from "lucide-react";
import "./styles.css";

const API = (port, path) => `http://localhost:${port}${path}`;

async function request(port, path, options = {}) {
  const response = await fetch(API(port, path), {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function useApi(port) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function run(path, options) {
    setError("");
    try {
      const data = await request(port, path, options);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  return { result, error, run, setResult };
}

function Field({ label, name, type = "text", value, onChange, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
      />
    </label>
  );
}

function SelectField({ label, name, value, onChange, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} value={value} onChange={onChange}>
        {children}
      </select>
    </label>
  );
}

function Button({ children, onClick, type = "button", tone = "primary" }) {
  return (
    <button className={`button ${tone}`} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function ResultBox({ result, error }) {
  return (
    <section className="result">
      <h2>Response</h2>
      {error ? <p className="error">{error}</p> : null}
      <pre>{JSON.stringify(result || { message: "No response yet" }, null, 2)}</pre>
    </section>
  );
}

function useForm(initial) {
  const [form, setForm] = useState(initial);
  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };
  return { form, setForm, onChange };
}

function ExpenseTracker() {
  const api = useApi(3001);
  const { form, setForm, onChange } = useForm({ amount: "", category: "", date: "", description: "" });
  const [filter, setFilter] = useState("");

  async function submit(event) {
    event.preventDefault();
    await api.run("/expenses", { method: "POST", body: JSON.stringify(form) });
    setForm({ amount: "", category: "", date: "", description: "" });
  }

  return (
    <AppShell title="Personal Expense Tracker" api={api}>
      <Panel title="Add Expense">
        <form className="grid" onSubmit={submit}>
          <Field label="Amount" name="amount" type="number" value={form.amount} onChange={onChange} />
          <Field label="Category" name="category" value={form.category} onChange={onChange} />
          <Field label="Date" name="date" type="date" value={form.date} onChange={onChange} />
          <Field label="Description" name="description" value={form.description} onChange={onChange} />
          <Button type="submit">Add</Button>
        </form>
      </Panel>
      <Panel title="Actions">
        <div className="actions">
          <Field label="Filter Category" name="filter" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <Button onClick={() => api.run(`/expenses${filter ? `?category=${filter}` : ""}`)}>Show Expenses</Button>
          <Button onClick={() => api.run("/expenses/total")}>Total</Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function BudgetManager() {
  const api = useApi(3002);
  const incomeForm = useForm({ income: "" });
  const budgetForm = useForm({ category: "", amount: "" });
  const expenseForm = useForm({ category: "", amount: "", description: "" });

  return (
    <AppShell title="Monthly Budget Manager" api={api}>
      <Panel title="Income">
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/income", { method: "POST", body: JSON.stringify(incomeForm.form) }); }}>
          <Field label="Monthly Income" name="income" type="number" value={incomeForm.form.income} onChange={incomeForm.onChange} />
          <Button type="submit">Save Income</Button>
        </form>
      </Panel>
      <Panel title="Budget and Expense">
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/budgets", { method: "POST", body: JSON.stringify(budgetForm.form) }); }}>
          <Field label="Category" name="category" value={budgetForm.form.category} onChange={budgetForm.onChange} />
          <Field label="Budget Amount" name="amount" type="number" value={budgetForm.form.amount} onChange={budgetForm.onChange} />
          <Button type="submit">Add Budget</Button>
        </form>
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/expenses", { method: "POST", body: JSON.stringify(expenseForm.form) }); }}>
          <Field label="Expense Category" name="category" value={expenseForm.form.category} onChange={expenseForm.onChange} />
          <Field label="Amount" name="amount" type="number" value={expenseForm.form.amount} onChange={expenseForm.onChange} />
          <Field label="Description" name="description" value={expenseForm.form.description} onChange={expenseForm.onChange} />
          <Button type="submit">Add Expense</Button>
        </form>
        <Button onClick={() => api.run("/dashboard")}>Show Dashboard</Button>
      </Panel>
    </AppShell>
  );
}

function EmiCalculator() {
  const api = useApi(3003);
  const { form, onChange } = useForm({ loanAmount: "", interestRate: "", tenureMonths: "" });
  return (
    <AppShell title="Loan EMI Calculator" api={api}>
      <Panel title="Calculate EMI">
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/calculate-emi", { method: "POST", body: JSON.stringify(form) }); }}>
          <Field label="Loan Amount" name="loanAmount" type="number" value={form.loanAmount} onChange={onChange} />
          <Field label="Interest Rate" name="interestRate" type="number" value={form.interestRate} onChange={onChange} />
          <Field label="Tenure Months" name="tenureMonths" type="number" value={form.tenureMonths} onChange={onChange} />
          <Button type="submit">Calculate</Button>
          <Button onClick={() => api.run("/calculations")}>History</Button>
        </form>
      </Panel>
    </AppShell>
  );
}

function PatientRegistration() {
  const api = useApi(3004);
  const { form, onChange } = useForm({ name: "", age: "", gender: "", phone: "", address: "", bloodGroup: "", symptoms: "" });
  const [search, setSearch] = useState("");
  return (
    <AppShell title="Patient Registration System" api={api}>
      <Panel title="Register Patient">
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/patients", { method: "POST", body: JSON.stringify(form) }); }}>
          {Object.keys(form).map((name) => (
            <Field key={name} label={label(name)} name={name} type={name === "age" ? "number" : "text"} value={form[name]} onChange={onChange} />
          ))}
          <Button type="submit">Register</Button>
        </form>
      </Panel>
      <Panel title="Search">
        <div className="actions">
          <Field label="Search" name="search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button onClick={() => api.run(`/patients${search ? `?search=${search}` : ""}`)}>Show Patients</Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function DoctorAppointments() {
  const api = useApi(3005);
  const { form, onChange } = useForm({ doctorId: "", date: "", time: "", patientName: "", patientPhone: "" });
  const [cancelId, setCancelId] = useState("");
  return (
    <AppShell title="Doctor Appointment System" api={api}>
      <Panel title="Book Appointment">
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/appointments", { method: "POST", body: JSON.stringify(form) }); }}>
          <Field label="Doctor ID" name="doctorId" type="number" value={form.doctorId} onChange={onChange} />
          <Field label="Date" name="date" type="date" value={form.date} onChange={onChange} />
          <Field label="Time" name="time" type="time" value={form.time} onChange={onChange} />
          <Field label="Patient Name" name="patientName" value={form.patientName} onChange={onChange} />
          <Field label="Patient Phone" name="patientPhone" value={form.patientPhone} onChange={onChange} />
          <Button type="submit">Book</Button>
        </form>
      </Panel>
      <Panel title="Actions">
        <div className="actions">
          <Button onClick={() => api.run("/doctors")}>Show Doctors</Button>
          <Button onClick={() => api.run("/appointments")}>Upcoming</Button>
          <Field label="Cancel ID" name="cancelId" type="number" value={cancelId} onChange={(e) => setCancelId(e.target.value)} />
          <Button onClick={() => api.run(`/appointments/${cancelId}/cancel`, { method: "PATCH" })}>Cancel</Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function MedicineReminder() {
  const api = useApi(3006);
  const { form, onChange } = useForm({ name: "", dosage: "", startDate: "", endDate: "", time: "", frequency: "" });
  const [id, setId] = useState("");
  return (
    <AppShell title="Medicine Reminder" api={api}>
      <Panel title="Add Medicine">
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/medicines", { method: "POST", body: JSON.stringify(form) }); }}>
          <Field label="Medicine Name" name="name" value={form.name} onChange={onChange} />
          <Field label="Dosage" name="dosage" value={form.dosage} onChange={onChange} />
          <Field label="Start Date" name="startDate" type="date" value={form.startDate} onChange={onChange} />
          <Field label="End Date" name="endDate" type="date" value={form.endDate} onChange={onChange} />
          <Field label="Time" name="time" type="time" value={form.time} onChange={onChange} />
          <Field label="Frequency" name="frequency" value={form.frequency} onChange={onChange} />
          <Button type="submit">Add</Button>
        </form>
      </Panel>
      <Panel title="Schedule">
        <div className="actions">
          <Button onClick={() => api.run("/schedule")}>Show Schedule</Button>
          <Field label="Medicine ID" name="id" type="number" value={id} onChange={(e) => setId(e.target.value)} />
          <Button onClick={() => api.run(`/medicines/${id}/taken`, { method: "PATCH" })}>Mark Taken</Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function Banking() {
  const api = useApi(3007);
  const [opening, setOpening] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <AppShell title="Bank Account Transaction Manager" api={api}>
      <Panel title="Transactions">
        <div className="actions">
          <Field label="Opening Balance" name="opening" type="number" value={opening} onChange={(e) => setOpening(e.target.value)} />
          <Button onClick={() => api.run("/opening-balance", { method: "POST", body: JSON.stringify({ amount: opening }) })}>Set Opening</Button>
          <Field label="Amount" name="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Button onClick={() => api.run("/deposit", { method: "POST", body: JSON.stringify({ amount }) })}>Deposit</Button>
          <Button onClick={() => api.run("/withdraw", { method: "POST", body: JSON.stringify({ amount }) })}>Withdraw</Button>
          <Button onClick={() => api.run("/transactions")}>History</Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function FinanceDashboard() {
  const api = useApi(3008);
  const { form, onChange } = useForm({ type: "income", amount: "", category: "", date: "", description: "" });
  const [month, setMonth] = useState("");
  const [search, setSearch] = useState("");
  return (
    <AppShell title="Personal Finance Dashboard" api={api}>
      <Panel title="Add Transaction">
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/transactions", { method: "POST", body: JSON.stringify(form) }); }}>
          <SelectField label="Type" name="type" value={form.type} onChange={onChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </SelectField>
          <Field label="Amount" name="amount" type="number" value={form.amount} onChange={onChange} />
          <Field label="Category" name="category" value={form.category} onChange={onChange} />
          <Field label="Date" name="date" type="date" value={form.date} onChange={onChange} />
          <Field label="Description" name="description" value={form.description} onChange={onChange} />
          <Button type="submit">Add</Button>
        </form>
      </Panel>
      <Panel title="Dashboard">
        <div className="actions">
          <Field label="Month YYYY-MM" name="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          <Field label="Search" name="search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button onClick={() => api.run(`/transactions?month=${month}&search=${search}`)}>Filter</Button>
          <Button onClick={() => api.run("/summary")}>Summary</Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function StockPortfolio() {
  const api = useApi(3009);
  const { form, onChange } = useForm({ symbol: "", quantity: "", buyPrice: "" });
  const [id, setId] = useState("");
  return (
    <AppShell title="Stock Portfolio Tracker" api={api}>
      <Panel title="Holdings">
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/stocks", { method: "POST", body: JSON.stringify(form) }); }}>
          <Field label="Symbol" name="symbol" value={form.symbol} onChange={onChange} />
          <Field label="Quantity" name="quantity" type="number" value={form.quantity} onChange={onChange} />
          <Field label="Buy Price" name="buyPrice" type="number" value={form.buyPrice} onChange={onChange} />
          <Button type="submit">Add Stock</Button>
        </form>
        <div className="actions">
          <Field label="Remove ID" name="id" type="number" value={id} onChange={(e) => setId(e.target.value)} />
          <Button onClick={() => api.run(`/stocks/${id}`, { method: "DELETE" })}>Remove</Button>
          <Button onClick={() => api.run("/portfolio")}>Summary</Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function ExpenseApproval() {
  const api = useApi(3010);
  const { form, onChange } = useForm({ amount: "", category: "", receiptFileName: "", description: "" });
  const [userId, setUserId] = useState("1");
  const [review, setReview] = useState({ id: "", status: "Approved" });
  return (
    <AppShell title="Expense Approval System" api={api}>
      <Panel title="Employee Submit">
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/expenses", { method: "POST", headers: { "user-id": userId }, body: JSON.stringify(form) }); }}>
          <Field label="User ID" name="userId" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <Field label="Amount" name="amount" type="number" value={form.amount} onChange={onChange} />
          <Field label="Category" name="category" value={form.category} onChange={onChange} />
          <Field label="Receipt File" name="receiptFileName" value={form.receiptFileName} onChange={onChange} />
          <Field label="Description" name="description" value={form.description} onChange={onChange} />
          <Button type="submit">Submit</Button>
        </form>
      </Panel>
      <Panel title="Manager Review">
        <div className="actions">
          <Button onClick={() => api.run("/manager/expenses", { headers: { "user-id": "2" } })}>Manager List</Button>
          <Field label="Expense ID" name="id" value={review.id} onChange={(e) => setReview({ ...review, id: e.target.value })} />
          <SelectField label="Status" name="status" value={review.status} onChange={(e) => setReview({ ...review, status: e.target.value })}>
            <option>Approved</option>
            <option>Rejected</option>
          </SelectField>
          <Button onClick={() => api.run(`/manager/expenses/${review.id}/review`, { method: "PATCH", headers: { "user-id": "2" }, body: JSON.stringify({ status: review.status }) })}>Review</Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function PatientRecords() {
  const api = useApi(3011);
  const { form, onChange } = useForm({ name: "", age: "", phone: "" });
  const [patientId, setPatientId] = useState("");
  const [visit, setVisit] = useState({ date: "", symptoms: "", prescription: "", doctorNotes: "" });
  return (
    <AppShell title="Medical Patient Records System" api={api}>
      <Panel title="Patient Records">
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/patients", { method: "POST", body: JSON.stringify(form) }); }}>
          <Field label="Name" name="name" value={form.name} onChange={onChange} />
          <Field label="Age" name="age" type="number" value={form.age} onChange={onChange} />
          <Field label="Phone" name="phone" value={form.phone} onChange={onChange} />
          <Button type="submit">Create Patient</Button>
        </form>
        <div className="actions">
          <Field label="Patient ID" name="patientId" type="number" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
          {Object.keys(visit).map((name) => (
            <Field key={name} label={label(name)} name={name} type={name === "date" ? "date" : "text"} value={visit[name]} onChange={(e) => setVisit({ ...visit, [name]: e.target.value })} />
          ))}
          <Button onClick={() => api.run(`/patients/${patientId}/visits`, { method: "POST", body: JSON.stringify(visit) })}>Add Visit</Button>
          <Button onClick={() => api.run("/doctor-dashboard")}>Dashboard</Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function QueueManagement() {
  const api = useApi(3012);
  const { form, onChange } = useForm({ doctorId: "", patientName: "", date: "", time: "" });
  const [appointmentId, setAppointmentId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  return (
    <AppShell title="Hospital Appointment & Queue Management" api={api}>
      <Panel title="Queue">
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/appointments", { method: "POST", body: JSON.stringify(form) }); }}>
          <Field label="Doctor ID" name="doctorId" type="number" value={form.doctorId} onChange={onChange} />
          <Field label="Patient Name" name="patientName" value={form.patientName} onChange={onChange} />
          <Field label="Date" name="date" type="date" value={form.date} onChange={onChange} />
          <Field label="Time" name="time" type="time" value={form.time} onChange={onChange} />
          <Button type="submit">Book</Button>
        </form>
        <div className="actions">
          <Button onClick={() => api.run("/doctors")}>Doctors</Button>
          <Field label="Appointment ID" name="appointmentId" value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} />
          <Button onClick={() => api.run(`/appointments/${appointmentId}/arrive`, { method: "PATCH" })}>Arrive</Button>
          <Field label="Doctor ID" name="doctorId" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} />
          <Button onClick={() => api.run(`/doctors/${doctorId}/call-next`, { method: "PATCH" })}>Call Next</Button>
          <Button onClick={() => api.run("/queue")}>Queue</Button>
          <Button onClick={() => api.run("/dashboard")}>Dashboard</Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function MedicalBilling() {
  const api = useApi(3013);
  const patient = useForm({ name: "", phone: "" });
  const invoice = useForm({ patientId: "", serviceIds: "1,2", discountPercent: "", taxPercent: "" });
  const [payId, setPayId] = useState("");
  return (
    <AppShell title="Medical Billing System" api={api}>
      <Panel title="Billing">
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/patients", { method: "POST", body: JSON.stringify(patient.form) }); }}>
          <Field label="Patient Name" name="name" value={patient.form.name} onChange={patient.onChange} />
          <Field label="Phone" name="phone" value={patient.form.phone} onChange={patient.onChange} />
          <Button type="submit">Add Patient</Button>
        </form>
        <form className="grid" onSubmit={(e) => {
          e.preventDefault();
          api.run("/invoices", { method: "POST", body: JSON.stringify({ ...invoice.form, serviceIds: invoice.form.serviceIds.split(",").map(Number) }) });
        }}>
          <Field label="Patient ID" name="patientId" value={invoice.form.patientId} onChange={invoice.onChange} />
          <Field label="Service IDs" name="serviceIds" value={invoice.form.serviceIds} onChange={invoice.onChange} />
          <Field label="Discount %" name="discountPercent" type="number" value={invoice.form.discountPercent} onChange={invoice.onChange} />
          <Field label="Tax %" name="taxPercent" type="number" value={invoice.form.taxPercent} onChange={invoice.onChange} />
          <Button type="submit">Create Invoice</Button>
        </form>
        <div className="actions">
          <Button onClick={() => api.run("/services")}>Services</Button>
          <Button onClick={() => api.run("/invoices")}>Invoices</Button>
          <Field label="Pay Invoice ID" name="payId" value={payId} onChange={(e) => setPayId(e.target.value)} />
          <Button onClick={() => api.run(`/invoices/${payId}/pay`, { method: "PATCH" })}>Mark Paid</Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function InsuranceClaims() {
  const api = useApi(3014);
  const { form, onChange } = useForm({ patientName: "", policyNumber: "", hospital: "", treatment: "", treatmentCost: "", admissionDate: "", documents: "" });
  const [review, setReview] = useState({ id: "", status: "Under Review", officerRemarks: "" });
  return (
    <AppShell title="Insurance Claim Management System" api={api}>
      <Panel title="Claim">
        <form className="grid" onSubmit={(e) => {
          e.preventDefault();
          api.run("/claims", { method: "POST", body: JSON.stringify({ ...form, documents: form.documents ? form.documents.split(",") : [] }) });
        }}>
          {Object.keys(form).map((name) => (
            <Field key={name} label={label(name)} name={name} type={name === "treatmentCost" ? "number" : name === "admissionDate" ? "date" : "text"} value={form[name]} onChange={onChange} />
          ))}
          <Button type="submit">Submit Claim</Button>
        </form>
        <div className="actions">
          <Button onClick={() => api.run("/claims")}>List Claims</Button>
          <Field label="Claim ID" name="id" value={review.id} onChange={(e) => setReview({ ...review, id: e.target.value })} />
          <SelectField label="Status" name="status" value={review.status} onChange={(e) => setReview({ ...review, status: e.target.value })}>
            <option>Under Review</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Paid</option>
          </SelectField>
          <Field label="Remarks" name="officerRemarks" value={review.officerRemarks} onChange={(e) => setReview({ ...review, officerRemarks: e.target.value })} />
          <Button onClick={() => api.run(`/claims/${review.id}/review`, { method: "PATCH", body: JSON.stringify({ status: review.status, officerRemarks: review.officerRemarks }) })}>Update</Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function HealthcareDashboard() {
  const api = useApi(3015);
  const patient = useForm({ name: "", phone: "" });
  const doctor = useForm({ name: "", specialization: "", availableSlots: "10:00,11:00" });
  const appointment = useForm({ patientId: "", doctorId: "", date: "", time: "" });
  const bill = useForm({ patientId: "", consultationFee: "", labCharges: "", medicineCharges: "" });
  const [payment, setPayment] = useState({ billId: "", amount: "" });
  return (
    <AppShell title="Complete Healthcare Finance Dashboard" api={api}>
      <Panel title="Hospital System">
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/patients", { method: "POST", body: JSON.stringify(patient.form) }); }}>
          <Field label="Patient Name" name="name" value={patient.form.name} onChange={patient.onChange} />
          <Field label="Phone" name="phone" value={patient.form.phone} onChange={patient.onChange} />
          <Button type="submit">Add Patient</Button>
        </form>
        <form className="grid" onSubmit={(e) => {
          e.preventDefault();
          api.run("/doctors", { method: "POST", body: JSON.stringify({ ...doctor.form, availableSlots: doctor.form.availableSlots.split(",") }) });
        }}>
          <Field label="Doctor Name" name="name" value={doctor.form.name} onChange={doctor.onChange} />
          <Field label="Specialization" name="specialization" value={doctor.form.specialization} onChange={doctor.onChange} />
          <Field label="Slots" name="availableSlots" value={doctor.form.availableSlots} onChange={doctor.onChange} />
          <Button type="submit">Add Doctor</Button>
        </form>
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/appointments", { method: "POST", body: JSON.stringify(appointment.form) }); }}>
          <Field label="Patient ID" name="patientId" value={appointment.form.patientId} onChange={appointment.onChange} />
          <Field label="Doctor ID" name="doctorId" value={appointment.form.doctorId} onChange={appointment.onChange} />
          <Field label="Date" name="date" type="date" value={appointment.form.date} onChange={appointment.onChange} />
          <Field label="Time" name="time" type="time" value={appointment.form.time} onChange={appointment.onChange} />
          <Button type="submit">Book Appointment</Button>
        </form>
        <form className="grid" onSubmit={(e) => { e.preventDefault(); api.run("/bills", { method: "POST", body: JSON.stringify(bill.form) }); }}>
          <Field label="Patient ID" name="patientId" value={bill.form.patientId} onChange={bill.onChange} />
          <Field label="Consultation Fee" name="consultationFee" type="number" value={bill.form.consultationFee} onChange={bill.onChange} />
          <Field label="Lab Charges" name="labCharges" type="number" value={bill.form.labCharges} onChange={bill.onChange} />
          <Field label="Medicine Charges" name="medicineCharges" type="number" value={bill.form.medicineCharges} onChange={bill.onChange} />
          <Button type="submit">Create Bill</Button>
        </form>
        <div className="actions">
          <Field label="Bill ID" name="billId" value={payment.billId} onChange={(e) => setPayment({ ...payment, billId: e.target.value })} />
          <Field label="Payment Amount" name="amount" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} />
          <Button onClick={() => api.run("/payments", { method: "POST", body: JSON.stringify(payment) })}>Pay</Button>
          <Button onClick={() => api.run("/dashboard")}>Dashboard</Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function AppShell({ title, children, api }) {
  return (
    <div className="workspace">
      <div className="content">
        <header className="page-header">
          <p>React frontend connected to Express in-memory API</p>
          <h1>{title}</h1>
        </header>
        {children}
      </div>
      <ResultBox result={api.result} error={api.error} />
    </div>
  );
}

function label(text) {
  return text.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

const apps = [
  { title: "Expense Tracker", icon: ReceiptText, component: ExpenseTracker },
  { title: "Budget Manager", icon: WalletCards, component: BudgetManager },
  { title: "EMI Calculator", icon: Banknote, component: EmiCalculator },
  { title: "Patient Registration", icon: HeartPulse, component: PatientRegistration },
  { title: "Appointments", icon: CalendarClock, component: DoctorAppointments },
  { title: "Medicine Reminder", icon: Pill, component: MedicineReminder },
  { title: "Bank Transactions", icon: Landmark, component: Banking },
  { title: "Finance Dashboard", icon: LayoutDashboard, component: FinanceDashboard },
  { title: "Stock Portfolio", icon: LineChart, component: StockPortfolio },
  { title: "Expense Approval", icon: ClipboardCheck, component: ExpenseApproval },
  { title: "Patient Records", icon: FileText, component: PatientRecords },
  { title: "Queue Management", icon: Stethoscope, component: QueueManagement },
  { title: "Medical Billing", icon: BriefcaseMedical, component: MedicalBilling },
  { title: "Insurance Claims", icon: ShieldCheck, component: InsuranceClaims },
  { title: "Healthcare Dashboard", icon: Search, component: HealthcareDashboard },
];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const ActiveApp = useMemo(() => apps[activeIndex].component, [activeIndex]);

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="brand">
          <span>Node.js CBA</span>
          <strong>15 React Interfaces</strong>
        </div>
        <nav>
          {apps.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                className={index === activeIndex ? "nav-item active" : "nav-item"}
                key={item.title}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <Icon size={18} />
                <span>{index + 1}. {item.title}</span>
              </button>
            );
          })}
        </nav>
      </aside>
      <ActiveApp />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
