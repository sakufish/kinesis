require('dotenv').config();

const geminiRoute = require('./routes/geminiRoute.js');
const usersRoute = require('./routes/users.js'); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
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

//connectDB();

app.use('/api', geminiRoute);
app.use('/api', usersRoute);

app.listen(port, () => console.log(`Server running on port ${port}`));