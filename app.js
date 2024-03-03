const express = require('express');
const Web3 = require('web3');

const app=express();
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`Server Listening at port:${PORT}`)
})