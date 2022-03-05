const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());

require('./database');

app.use(cors());

app.use('/', require('./routes/index'));

app.listen(3000, () => {
    console.log('Server on port 3000');
});