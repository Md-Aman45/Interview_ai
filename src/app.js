const express = require('express');
const authRouter = require('./routes/auth.routes')

const app = express();

// Middleware
app.use(express.json());



// routes...
app.use("/api/auth", authRouter);




module.exports = app;