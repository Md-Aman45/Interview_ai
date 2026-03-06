const express = require("express");
const healthRouter = express.Router();

const { healthCheckController } = require("../controller/health.controller");

/**
 * @route GET /api/v1/health
 * @description Check server and database health
 * @access Public
 */
healthRouter.get("/health", healthCheckController);

module.exports = healthRouter;