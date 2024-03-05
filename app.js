const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const Creator = require('./models/contentcreatormodel'); // Importing the content creator model
const mongoose = require('./conn'); // Importing the Mongoose connection

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

app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const existingUser = await Creator.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        } else {
            const NewCreator = new Creator({ email, username, password });
            await NewCreator.save();
            console.log("User registered successfully")
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await Creator.findOne({ username });
        if (existingUser) {
            if (existingUser.password === password) { 
                console.log('User logged in successfully!');
                res.redirect("/upload_content")
            } else {
                return res.status(400).json({ message: 'Invalid password' }); 
            }
        } else {
            return res.status(400).json({ message: 'User not found' }); 
        }
    } catch (error) {
        console.error('Error during Login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
