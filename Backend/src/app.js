const express = require('express')
const app =express();
const aiRoutes= require('./routes/ai.routes')
const cors= require('cors')

app.use(express.json());

const allowedOrigins = [
  "https://codexai-9woh.onrender.com", 
  "http://localhost:5173" // Keep this for local testing
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true // Allow cookies if needed
  }))



  


app.use('/ai',aiRoutes)
module.exports= app;