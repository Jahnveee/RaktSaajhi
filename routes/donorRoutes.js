const express = require("express");
const Donor = require("../models/donorModel");
const router = express.Router();

// Add a donor
router.post("/add", async (req, res) => {
    try {
        const newDonor = new Donor(req.body);
        await newDonor.save();
        res.status(201).send({ message: "Donor added successfully!" });
    } catch (err) {
        res.status(500).send({ error: "Error adding donor: " + err.message });
    }
});

// Fetch all donors
router.get("/", async (req, res) => {
    try {
        const donors = await Donor.find();
        res.status(200).json(donors);
    } catch (err) {
        res.status(500).send({ error: "Error fetching donors: " + err.message });
    }
});

module.exports = router;