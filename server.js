const express = require('express');
const db = require('./config/database');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();

//Test Connection
db.authenticate().then(() => console.log('Connected')).catch(error => console.log('Error: ' + error));

app.use(cors());

app.use('/api', require('./routes/api'));

app.listen(PORT, console.log(`Server running on port ${PORT}`));