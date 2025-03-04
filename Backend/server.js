const express = require("express");
const path = require("path");


require('dotenv').config()
const app = require('./src/app')

const _dirname = path.resolve();

app.use(express.static(path.join(__dirname,"../frontend/dist")));

app.get('*',(_,res)=>{
    res.sendFile(path.resolve(__dirname,"../frontend/dist/index.html"))
})
const PORT = process.env.PORT || 3000;  

app.listen(PORT);