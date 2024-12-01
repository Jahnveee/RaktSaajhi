const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    blood_group: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
});

const Donor = mongoose.model("Donor", donorSchema);
module.exports = Donor;
