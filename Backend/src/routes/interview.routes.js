const express = require('express');
const { authUser } = require('../middlewares/auth.middleware');
const { upload, extractResumeText } = require('../middlewares/file.middleware');
const { checkLimit } = require('../middlewares/limit.middleware');
const {
    generateReportController,
    getAllReportsController,
    getReportByIdController,
    deleteReportController,
} = require('../controller/interview.controller');


const interviewRouter = express.Router();


interviewRouter.post('/generate', authUser, checkLimit('report'), upload.single('resume'), extractResumeText, generateReportController);

interviewRouter.get('/reports', authUser, getAllReportsController);

interviewRouter.get('/reports/:id', authUser, getReportByIdController);

interviewRouter.delete('/reports/:id', authUser, deleteReportController);



module.exports = interviewRouter;