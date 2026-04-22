const express = require('express');
const authRouter = require('./routes/auth.routes');
const healthRouter = require('./routes/health.routes');
const interviewRouter = require('./routes/interview.routes');
const mockRouter = require('./routes/mock.routes');
const analyticsRouter = require('./routes/analytics.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


// routes...
app.use("/api/auth", authRouter);
app.use("/api/v1/", healthRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/mock", mockRouter);
app.use("/api/analytics", analyticsRouter);



module.exports = app;