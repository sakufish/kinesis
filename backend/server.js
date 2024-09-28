require('dotenv').config();

const geminiRoute = require('./routes/geminiRoute.js');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('mongo connected');
    } catch (error) {
        console.error('cant connect mongo:', error);
        process.exit(1);
    }
};

connectDB();

app.use('/api', geminiRoute);

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});