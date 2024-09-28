require('dotenv').config();
const geminiRoute = require('./routes/geminiRoute.js');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', geminiRoute);

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});