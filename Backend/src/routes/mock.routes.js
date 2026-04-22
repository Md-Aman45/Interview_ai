const express = require('express');
const { authUser } = require('../middlewares/auth.middleware');
const { chcekLimit, checkLimit } = require('../middlewares/limit.middleware');
const {
    startMockSessionController,
    submitAnswerController,
    endMockSessionController,
    getAllSessionsController
} = require('../controller/mock.controller');


const mockRouter = express.Router();



mockRouter.post("/start", authUser, checkLimit("mock"), startMockSessionController);
mockRouter.post("/answer", authUser, submitAnswerController);
mockRouter.post("/end", authUser, endMockSessionController);
mockRouter.get("/sessions", authUser, getAllSessionsController);



module.exports = mockRouter;