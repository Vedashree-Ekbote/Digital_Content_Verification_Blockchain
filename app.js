const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Creator = require('./models/contentcreatormodel'); // content creator model
const mongoose = require('./conn'); 
const { Web3 } = require('web3');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/templates", express.static(path.join(__dirname, "templates")));
app.use(express.static(path.join(__dirname, "templates")));

const providerUrl = 'https://eth-sepolia.g.alchemy.com/v2/RuE83N5-YIkfrP_hDuYLKb6IDBNmJE-s'; 
const web3 = new Web3(providerUrl);

const ContentRegistryArtifact = require('./artifacts/contracts/ContentVerifier.sol/ContentRegistry.json');
const contractAddress = '0x7212c8739e732E66208b06175c2bbF26DdC1a377';  
const contractInstance = new web3.eth.Contract(ContentRegistryArtifact.abi, contractAddress);

// Function to generate hash key
function generateHash(data) {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

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

app.get("/verify_content", (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'verifyContent.html')); 
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

app.post('/verify_content', async (req, res) => {
    try {
        const { content } = req.body;

        // Generate hash key for the provided content
        const hashKey = generateHash(content);
        console.log('Hash Key:', hashKey);
        // Call the contract method to verify the content
        const result = await contractInstance.methods.verifyContent(hashKey).call();

        if (result[0] !== 'Invalid content') {
            console.log('Content verified successfully!');
            // Check if the result array contains the username and timestamp
            if (result.length >= 2 && result[1] !== undefined && result[2] !== undefined) {
                // Convert the timestamp to a string
                const timestampString = result[2].toString();
                res.status(200).json({ message: 'Content verified successfully!', username: result[1], timestamp: timestampString });
            } else {
                res.status(500).json({ message: 'Username or timestamp not found in result' });
            }
        } else {
            res.status(400).json({ message: 'Invalid content' });
        }
    } catch (error) {
        console.error('Error verifying content:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/upload_content', async (req, res) => {
    try {
        const { content, username } = req.body;

        // Generate hash key for the uploaded content
        const hashKey = generateHash(content);
        const timestamp = Date.now();
        // Get the account private key
        const privateKey = '1500db2e66772ede80254bd00d3b3cf6023b1f0b002d7506c5807bed295510c0'; // private key

        // Create a new transaction object
        const txObject = {
            to: contractAddress,
            data: contractInstance.methods.registerContent(hashKey, username,timestamp).encodeABI(),
            gasLimit: web3.utils.toHex(200000), // Specify gas limit
            gasPrice: web3.utils.toHex(web3.utils.toWei('0', 'gwei')), // Specify gas price
            nonce: await web3.eth.getTransactionCount('0x0b3dC35bEA50439E3800c590C141775d2Fd54592') // Get the nonce
        };

        // Sign the transaction
        const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

        // Send the signed transaction
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log("Transaction receipt:", receipt);

        console.log('Content registered successfully!');
        console.log('Hash Key:', hashKey); // Print hash key to console
        res.status(200).json({ message: 'Content registered successfully!', transactionHash: receipt.transactionHash });
    } catch (error) {
        console.error('Error uploading content:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
