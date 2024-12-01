const express = require("express");
const Hospital = require("../models/hospitalModel");
const router = express.Router();

// Add a hospital
router.post("/add", async (req, res) => {
    try {
        const newHospital = new Hospital(req.body);
        await newHospital.save();
        res.status(201).send({ message: "Hospital added successfully!" });
    } catch (err) {
        res.status(500).send({ error: "Error adding hospital: " + err.message });
    }
});

// Fetch hospitals based on blood type
router.get("/search", async (req, res) => {
    const { blood_group } = req.query;
    try {
        const hospitals = await Hospital.find({ blood_types: blood_group });
        res.status(200).json(hospitals);
    } catch (err) {
        res.status(500).send({ error: "Error searching hospitals: " + err.message });
    }
});

module.exports = router;