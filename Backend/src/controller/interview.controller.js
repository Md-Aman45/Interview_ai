const { generateInterviewReport, generateResumeContent } = require('../services/ai.service');
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
            user: req.user.id,
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
            .find({ user: req.user.id })
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
            user: req.user.id
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
            user: req.user.id
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









async function generateResumePdfController(req, res) {
    try {
        const puppeteer = require("puppeteer-core");

        const report = await interviewReportModel.findOne({
            _id: req.params.reportId,
            user: req.user.id
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        // Generate tailored resume content using Gemini
        const resumeData = await generateResumeContent({
            resume: report.resume,
            jobDescription: report.jobDescription,
            selfDescription: report.selfDescription
        });

        // Build HTML
        const skillsHTML = resumeData.skills
            .map(s => `<span class="skill">${s}</span>`)
            .join("");

        const projectsHTML = resumeData.projects.map(proj => `
            <div class="item">
                <div class="item-header">
                    <span class="item-title">${proj.name}</span>
                </div>
                <div class="item-sub">${proj.stack}</div>
                <ul>${proj.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
            </div>
        `).join("");

        const educationHTML = resumeData.education.map(edu => `
            <div class="item">
                <div class="item-header">
                    <span class="item-title">${edu.degree}</span>
                    <span class="item-date">${edu.year}</span>
                </div>
                <div class="item-sub">${edu.school}${edu.grade ? " | " + edu.grade : ""}</div>
            </div>
        `).join("");

        const html = `
            <!DOCTYPE html>
            <html>
                <head>
                <meta charset="UTF-8">
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a2e; line-height: 1.6; }
                        .header { border-bottom: 3px solid #4F46E5; padding-bottom: 14px; margin-bottom: 20px; }
                        .name { font-size: 28px; font-weight: 700; color: #1a1a2e; }
                        .contact { font-size: 12px; color: #666; margin-top: 4px; }
                        .section { margin-bottom: 18px; }
                        .section-title { font-size: 12px; font-weight: 700; color: #4F46E5; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 10px; }
                        .summary { color: #374151; line-height: 1.7; }
                        .skills-wrap { display: flex; flex-wrap: wrap; gap: 7px; }
                        .skill { background: #EEF2FF; color: #4338CA; padding: 4px 12px; border-radius: 20px; font-size: 11.5px; font-weight: 500; }
                        .item { margin-bottom: 12px; }
                        .item-header { display: flex; justify-content: space-between; }
                        .item-title { font-weight: 600; color: #111827; }
                        .item-date { color: #9CA3AF; font-size: 12px; }
                        .item-sub { color: #6B7280; font-size: 12px; margin: 2px 0 6px; }
                        ul { padding-left: 18px; }
                        ul li { color: #374151; font-size: 12.5px; margin-bottom: 3px; }
                    </style>
                </head>
                <body>

                    <div class="header">
                        <div class="name">${resumeData.name}</div>
                        <div class="contact">${[resumeData.email, resumeData.phone, resumeData.location].filter(Boolean).join("  •  ")}</div>
                    </div>

                    <div class="section">
                        <div class="section-title">Professional Summary</div>
                        <div class="summary">${resumeData.summary}</div>
                    </div>

                    <div class="section">
                        <div class="section-title">Skills</div>
                        <div class="skills-wrap">${skillsHTML}</div>
                    </div>

                    <div class="section">
                        <div class="section-title">Projects</div>
                        ${projectsHTML}
                    </div>

                    <div class="section">
                        <div class="section-title">Education</div>
                        ${educationHTML}
                    </div>

                </body>
            </html>
`;

        // Launch Puppeteer and generate PDF
        const browser = await puppeteer.launch({
            headless: "new",
            executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" },
            printBackground: true
        });

        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="tailored_resume.pdf"`
        });

        res.send(pdfBuffer);

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
    deleteReportController,
    generateResumePdfController
};