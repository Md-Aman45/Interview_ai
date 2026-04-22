const { evaluateAnswer, generateOpeningMessage } = require('../services/groq.service');
const mockSessionModel = require('../models/mockSession.model');
const interviewReportModel = require('../models/interviewReport.model');


async function startMockSessionController(req, res) {
    try {
        const { reportId } = req.body;

        const report = await interviewReportModel.findOne({
            _id: reportId,
            user: req.user._id
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        
        const opening = await generateOpeningMessage({
            candidateName: req.user.name,
            jobTitle: report.title,
            resume: report.resume
        });


        const session = await mockSessionModel.create({
            user: req.user._id,
            report: reportId,
            jobTitle: report.title,
            answers: [],
            status: "ongoing",
            startedAt: new Date()
        });



        res.status(201).json({
            success: true,
            sessionId: session._id,
            message: opening.message,
            firstQuestion: opening.firstQuestion,
            startedAt: session.startedAt,
            timeLimit: 30,
            usage: req.usageInfo
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}






async function submitAnswerController(req, res) {
    try {
        const { sessionId, question, userAnswer } = req.body;

        if (!sessionId || !question || !userAnswer) {
            return res.status(400).json({
                success: false,
                message: "sessionId, question and userAnswer are required"
            });
        }


        const session = await mockSessionModel.findOne({
            _id: sessionId,
            user: req.user._id
        });


        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }


        if (session.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Session already completed"
            });
        }


        
        const now = new Date();
        const startedAt = new Date(session.startedAt);
        const minutesElapsed = (now - startedAt) / (1000 * 60);

        if (minutesElapsed >= 30) {
            const totalScore = session.answers.reduce((sum, a) => sum + a.score, 0);

            session.averageScore = session.answers.length > 0
                ? parseFloat((totalScore / session.answers.length).toFixed(1))
                : 0;
            
            session.totalQuestions = session.answers.length;
            session.status = "completed";

            await session.save();


            return res.status(400).json({
                success: false,
                message: "Time limit reached. Interview ended automatically here.",
                timeUp: true,
                summary: {
                    totalQuestions: session.totalQuestions,
                    averageScore: session.averageScore
                }
            });
        }



        const evaluation = await evaluateAnswer({
            question,
            userAnswer,
            jobTitle: session.jobTitle
        });

        session.answers.push({
            question,
            userAnswer,
            score: evaluation.feedback,
            idealAnswer: evaluation.idealAnswer,
            nextQuestion: evaluation.nextQuestion
        });

        await session.save();


        const minutesRemaining = parseFloat((30 - minutesElapsed).toFixed(1));

        res.status(200).json({
            success: true,
            score: evaluation.score,
            feedback: evaluation.feedback,
            idealAnswer: evaluation.idealAnswer,
            nextQuestion: evaluation.nextQuestion,
            minutesRemaining
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}






async function endMockSessionController(req, res) {
    try {
        const { sessionId } = req.body;

        const session = await mockSessionModel.findOne({
            _id: sessionId,
            user: req.user._id
        });

        
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        if (session.status == "completed") {
            return res.status(400).json({
                success: false,
                message: "Session already completed"
            });
        }


        const totalScore = session.answers.reduce((sum, a) => sum + a.score, 0);
        const avgScore = session.answers.length > 0
            ? parseFloat((totalScore / session.answers.length).toFixed(1))
            : 0;

        session.averageScore = avgScore;
        session.totalQuestions = session.answers.length;
        session.status = "completed";
        
        await session.save();

        res.status(200).json({
            success: true,
            message: "Mock interview completed",
            summary: {
                totalQuestions: session.totalQuestions,
                averageScore: session.averageScore,
                answers: session.answers
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}




async function getAllSessionsController(req, res) {
    try {
        const sessions = await mockSessionModel
            .find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .select("jobTitle averageScore totalQuestions status startedAt createdAt");

        res.status(200).json({
            success: true,
            count: sessions.length,
            sessions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}




module.exports = {
    startMockSessionController,
    submitAnswerController,
    endMockSessionController,
    getAllSessionsController
};