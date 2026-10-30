const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Pet = require('./models/pet');

const app = express();

app.use(cors());
app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log(err));


// ======================
// POST - Add Pet
// ======================

app.post('/pets', async (req, res) => {

    try {

        const pet = new Pet(req.body);

        await pet.save();

        res.json({
            message: 'Pet Added Successfully'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

});


// ======================
// GET - All Pets
// ======================

app.get('/pets', async (req, res) => {

    try {

        const pets = await Pet.find();

        res.json(pets);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// ======================
// DELETE - Pet
// ======================

app.delete('/pets/:id', async (req, res) => {

    try {

        await Pet.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Pet Deleted Successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// ======================
// SERVER
// ======================


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed:", err);
    });