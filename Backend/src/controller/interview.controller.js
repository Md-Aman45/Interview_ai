const generateInterviewReport = require('../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');


async function generateReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;
        const resume = req.resumeText;

        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                success: false,
                message: "selfDescription and jobDescription are required"
            });
        }

        if (!resume) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF is required"
            });
        }


        const aiReport = await generateInterviewReport({
            resume,
            selfDescription,
            jobDescription
        });


        const report = await interviewReportModel.create({
            user: req.user._id,
            resume,
            selfDescription,
            jobDescription,
            ...aiReport
        });


        res.status(201).json({
            success: true,
            message: "Report generated successfully",
            report,
            usage: req.usageInfo
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}






async function getAllReportsController(req, res) {
    try {
        const reports = await interviewReportModel
            .find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .select("title matchScore hiringRecommendation averageScore createdAt");

        
        res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}




async function getReportByIdController(req, res) {
    try {
        const report = await interviewReportModel.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        res.status(200).json({
            success: true,
            report
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}




async function deleteReportController(req, res) {
    try {
        const report = await interviewReportModel.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });


        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Report deleted"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



module.exports = {
    generateReportController,
    getAllReportsController,
    getReportByIdController,
    deleteReportController
};