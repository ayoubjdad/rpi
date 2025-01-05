require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const clientRoutes = require("./routes/clients");
const invoiceRoutes = require("./routes/invoices");

// Create an Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection string from environment variables
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/clients", clientRoutes);
app.use("/invoices", invoiceRoutes);

module.exports = app;
