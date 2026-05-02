const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.get('/', (req, res) => {
    res.json({ message: 'KinderCare API is running (MVC Style)' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`=============================================`);
});

module.exports = app;
