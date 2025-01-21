const mongoose = require("mongoose");

// Main schema for Client
const clientSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
