const mongoose = require("mongoose");

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
});

module.exports = mongoose.model("Client", clientSchema);
