const express = require('express');
const sendMail = require('./mail');
const log = console.log;
const app = express();

const path = require('path');

const PORT = 8080;

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

app.post('/email', (req, res) => {
    const { subject, email, text } = req.body;
    console.log('Data: ', req.body);
    sendMail(subject, email, text, function(err, data) {
        if (err) {
            res.status(500).json({ message: 'Uh-oh, something went wrong on the server' });
        } else {
            res.json({ message: "Message sent!" });
        }
    });
});

app.use(express.static(path.join(__dirname, '../')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});
app.listen(PORT, () => log('Server is starting on port, ', 8080));