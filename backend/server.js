// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Create an Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection string
const MONGO_URI =
  "mongodb+srv://ayoubjdad1:O6sdnvt1j8MjIbqp@bigfocus.lx7trmo.mongodb.net/";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the Invoice schema and model
const invoiceSchema = new mongoose.Schema({
  id: String,
  invoiceNumber: Number,
  date: Date,
  clientId: String,
  items: Array,
  totalHT: Number,
  TVA: Number,
  notes: String,
  status: String,
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

// Define the Client schema and model
const clientSchema = new mongoose.Schema({
  id: String,
  ICE: String,
  customerName: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    country: String,
  },

  //   email: { type: String, required: true, unique: true },
});

const Client = mongoose.model("Client", clientSchema);

// CRUD routes for Invoice
app.post("/invoices", async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).send(invoice);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("clientId");
    res.status(200).send(invoices);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/invoices/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("clientId");
    if (!invoice) return res.status(404).send({ message: "Invoice not found" });
    res.status(200).send(invoice);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put("/invoices/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!invoice) return res.status(404).send({ message: "Invoice not found" });
    res.status(200).send(invoice);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete("/invoices/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).send({ message: "Invoice not found" });
    res.status(200).send({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// CRUD routes for Client
app.post("/clients", async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).send(client);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/clients", async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).send(clients);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/clients/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).send({ message: "Client not found" });
    res.status(200).send(client);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put("/clients/:id", async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!client) return res.status(404).send({ message: "Client not found" });
    res.status(200).send(client);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete("/clients/:id", async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).send({ message: "Client not found" });
    res.status(200).send({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
