const express = require('express');
const authRouter = require('./routes/auth.routes')
const healthRouter = require('./routes/health.routes')
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());


// routes...
app.use("/api/auth", authRouter);
app.use("/api/v1/", healthRouter)



module.exports = app;