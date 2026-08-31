const express = require("express");

const app = express();
const PORT = 3014;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, user-id");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let claims = [];
let nextClaimId = 1;

app.post("/claims", (req, res) => {
  const {
    patientName,
    policyNumber,
    hospital,
    treatment,
    treatmentCost,
    admissionDate,
    documents,
  } = req.body;

  if (!patientName || !policyNumber || !hospital || !treatment || !treatmentCost || !admissionDate) {
    return res.status(400).json({ message: "all claim fields are required" });
  }

  const claim = {
    id: nextClaimId++,
    patientName,
    policyNumber,
    hospital,
    treatment,
    treatmentCost: Number(treatmentCost),
    admissionDate,
    documents: documents || [],
    status: "Submitted",
    officerRemarks: "",
  };

  claims.push(claim);
  res.status(201).json(claim);
});

app.get("/claims", (req, res) => {
  const { status, search } = req.query;
  let result = claims;

  if (status) {
    result = result.filter((claim) => claim.status === status);
  }

  if (search) {
    const text = search.toLowerCase();
    result = result.filter((claim) =>
      claim.patientName.toLowerCase().includes(text) ||
      claim.policyNumber.toLowerCase().includes(text)
    );
  }

  res.json(result);
});

app.patch("/claims/:id/review", (req, res) => {
  const claim = claims.find((item) => item.id === Number(req.params.id));
  const { status, officerRemarks } = req.body;

  if (!claim) {
    return res.status(404).json({ message: "Claim not found" });
  }

  if (!["Under Review", "Approved", "Rejected", "Paid"].includes(status)) {
    return res.status(400).json({ message: "invalid claim status" });
  }

  claim.status = status;
  claim.officerRemarks = officerRemarks || claim.officerRemarks;
  res.json(claim);
});

app.listen(PORT, () => {
  console.log(`Insurance Claim API running on http://localhost:${PORT}`);
});
