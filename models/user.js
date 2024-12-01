const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // Use bcrypt for hashing in production
    searchHistory: [
        {
            type: {
                searchType: { type: String, enum: ['donor', 'hospital'], required: true },
                query: { type: String, required: true },
            },
            date: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model('User', userSchema);
