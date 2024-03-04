const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/templates", express.static(path.join(__dirname, "templates")));
app.use(express.static(path.join(__dirname, "templates")));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'Home.html')); 
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'Register.html')); 
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'CreatorLogin.html')); 
});
app.get("/upload_content", (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'ContentUpload.html')); 
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
