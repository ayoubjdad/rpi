const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  id: String,
  invoiceNumber: Number,
  billingDate: Date,
  paymentDate: Date,
  clientId: String,
  items: Array,
  totalHT: Number,
  totalTTC: Number,
  TVA: Number,
  notes: String,
  status: String,
});

module.exports = mongoose.model("Invoice", invoiceSchema);
