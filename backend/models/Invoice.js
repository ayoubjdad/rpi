const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  id: String,
  invoiceNumber: Number,
  date: Date,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  items: Array,
  totalHT: Number,
  TVA: Number,
  notes: String,
  status: String,
});

module.exports = mongoose.model("Invoice", invoiceSchema);
