const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')

const app = express();


// Connect Database
connectDB();

app.get('/', (req, res) => res.send('API Running'));

// Init Middleware

app.use(
    express.json({ extended: false }),
    cors({
        origin: 'http://localhost:3000'
    })
)


// Define Routes
app.use('/api/users', require('./routs/api/users'))
app.use('/api/auth', require('./routs/api/auth'))
app.use('/api/party', require('./routs/api/party'))
app.use('/api/profile', require('./routs/api/profile'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
