const express = require('express');
const { authUser } = require('../middlewares/auth.middleware');
const { getAnalyticsSummaryController, getUsageController } = require('../controller/analytics.controller');


const analyticsRouter = express.Router();



analyticsRouter.get("/summary", authUser, getAnalyticsSummaryController);

analyticsRouter.get("/usage", authUser, getUsageController);



module.exports = analyticsRouter;