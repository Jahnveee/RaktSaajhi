const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
    hospital_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    blood_types: { type: [String], required: true },
});
const Hospital = mongoose.model("Hospital", hospitalSchema);
module.exports = Hospital;
