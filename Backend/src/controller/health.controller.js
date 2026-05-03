const mongoose = require("mongoose");

/**
 * @name Health Check Controller
 * @description Check server, database and system health
 * @access Public
 */

async function healthCheckController(req, res) {
    console.log("✅ Health check endpoint called");
    try {
        const dbState = mongoose.connection.readyState;

        const healthStatus = {
            status: "OK",
            uptime: process.uptime(),
            timestamp: new Date(),
            environment: process.env.NODE_ENV || "development",
            database: {
                status: dbState === 1 ? "CONNECTED" : "DISCONNECTED"
            },
            memoryUsage: {
                rss: process.memoryUsage().rss,
                heapTotal: process.memoryUsage().heapTotal,
                heapUsed: process.memoryUsage().heapUsed
            }
        };

        console.log("Health Status:", healthStatus);

        res.status(200).json(healthStatus);

    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: error.message
        });
    }
}

module.exports = {
    healthCheckController
};