const express = require('express');
const cors = require('cors');
const contactsRouter = require('./routes/contacts');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use('/api/contacts', contactsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});