const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");

// CRUD routes for Invoice
router.post("/", async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).send(invoice);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("clientId");
    res.status(200).send(invoices);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("clientId");
    if (!invoice) return res.status(404).send({ message: "Invoice not found" });
    res.status(200).send(invoice);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).send({ message: "Invoice not found" });
    res.status(200).send({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
