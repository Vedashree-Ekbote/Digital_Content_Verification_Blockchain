const express = require('express');
const Web3 = require('web3');

const app=express();

app.get("/" ,(req,res)=>{
    res.send("Hello");
})
const PORT=process.env.PORT||3000;
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});