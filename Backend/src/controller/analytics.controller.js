const mockSessionModel = require('../models/mockSession.model');
const usageLimitModel = require('../models/usageLimit.model');


async function getAnalyticsSummaryController(req, res) {
    try {
        const sessions = await mockSessionModel.find({
            user: req.user.id,
            status: "completed"
        }).sort({ createdAt: 1 });

        if (sessions.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    totalSessions: 0,
                    overallAverageScore: 0,
                    scoreHistory: [],
                    weakTopics: []
                }
            });
        }


        const scoreHistory = sessions.map(s => ({
            date: s.createdAt.toDateString(),
            jobTitle: s.jobTitle,
            averageScore: s.averageScore,
            totalQuestions: s.totalQuestions
        }));


        const overallAvg = parseFloat(
            (sessions.reduce((sum, s) => sum + s.averageScore, 0) / sessions.length).toFixed(1)
        );


        const weakAnswers = sessions.flatMap(s =>
            s.answers.filter(a => a.score < 5)
        );


        const weakTopics = Object.entries(
            weakAnswers.reduce((acc, a) => {
                const key = a.question.substring(0, 60);
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {})
        )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([question, count]) => ({ question, count }));


        res.status(200).json({
            success: true,
            data: {
                totalSessions: sessions.length,
                overallAverageScore: overallAvg,
                scoreHistory,
                weakTopics
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}




async function getUsageController(req, res) {
    try {
        const usageData = await usageLimitModel.find({
            user: req.user.id
        });

        const LIMITS = { report: 20, resume: 15, mock: 10 };

        const usage = ["report", "resume", "mock"].map(type => {
            const found = usageData.find(u => u.type === type);

            return {
                type,
                used: found ? found.count : 0,
                limit: LIMITS[type],
                resetsOn: found ? found.resetAt.toDateString(): "Not used yet"
            };
        });


        res.status(200).json({
            success: true,
            usage
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



module.exports = { getAnalyticsSummaryController, getUsageController };