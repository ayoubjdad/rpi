const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

router.post("/", async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).send(client);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).send(clients);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).send({ message: "Client not found" });
    res.status(200).send(client);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).send({ message: "Client not found" });
    res.status(200).send({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
