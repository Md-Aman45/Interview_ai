const { generateInterviewReport, generateResumeContent } = require('../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');


async function generateReportController(req, res) {
    try {
        const { selfDescription, jobDescription, linkedin, github, portfolio, leetcode, gfg, extraLinks } = req.body;
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
            links: { linkedin, github, portfolio, leetcode, gfg, extraLinks: extraLinks || [] },
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









// async function generateResumePdfController(req, res) {
//     try {
//         const puppeteer = require("puppeteer-core");

//         const report = await interviewReportModel.findOne({
//             _id: req.params.reportId,
//             user: req.user.id
//         });

//         if (!report) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Report not found"
//             });
//         }

//         // Generate tailored resume content using Gemini
//         const resumeData = await generateResumeContent({
//             resume: report.resume,
//             jobDescription: report.jobDescription,
//             selfDescription: report.selfDescription
//         });


//         const contactParts = [
//             resumeData.location,
//             resumeData.phone,
//             resumeData.email ? `<a href="mailto:${resumeData.email}" style="color:#4f46e5;text-decoration:none">${resumeData.email}</a>` : null,
//             resumeData.linkedin ? `<a href="${resumeData.linkedin}" style="color:#4f46e5;text-decoration:none">LinkedIn</a>` : null,
//             resumeData.github ? `<a href="${resumeData.github}" style="color:#4f46e5;text-decoration:none">GitHub</a>` : null,
//             resumeData.portfolio ? `<a href="${resumeData.portfolio}" style="color:#4f46e5;text-decoration:none">Portfolio</a>` : null,
//         ].filter(Boolean).join('  •  ');

//         // Build HTML
//         const skillsHTML = resumeData.skills
//             .map(s => `<span class="skill">${s}</span>`)
//             .join("");


//         const projectsHTML = resumeData.projects.map(proj => `
//             <div class="item">
//                 <div class="item-header">
//                     <span class="item-title">${proj.name}</span>
//                 </div>
//                 <div class="item-sub">${proj.stack}</div>
//                 <ul>${proj.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
//             </div>
//         `).join("");


//         const educationHTML = resumeData.education.map(edu => `
//             <div class="item">
//                 <div class="item-header">
//                     <span class="item-title">${edu.degree}</span>
//                     <span class="item-date">${edu.year}</span>
//                 </div>
//                 <div class="item-sub">${edu.school}${edu.grade ? " | " + edu.grade : ""}</div>
//             </div>
//         `).join("");




//             const html = `
//                 <!DOCTYPE html>
//                     <html>
//                         <head>
//                             <meta charset="UTF-8">
//                             <style>
//                                 * { margin: 0; padding: 0; box-sizing: border-box; }
//                                 body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12.5px; color: #1a1a2e; line-height: 1.6; }

//                                 .header { text-align: center; padding-bottom: 14px; margin-bottom: 16px; border-bottom: 3px solid #352ebc; }
//                                 .name { font-size: 30px; font-weight: 700; letter-spacing: 2px; color: #1a1a2e; text-transform: uppercase; }
//                                 .role { font-size: 13px; color: #241da5; font-weight: 500; margin: 4px 0; }
//                                 .contact { font-size: 11px; color: #555; margin-top: 5px; }

//                                 .section { margin-bottom: 16px; }
//                                 .section-title {
//                                     font-size: 11px; font-weight: 700; color: #322bbb;
//                                     text-transform: uppercase; letter-spacing: 2px;
//                                     border-bottom: 1.5px solid #e5e7eb;
//                                     padding-bottom: 4px; margin-bottom: 10px;
//                                 }

//                                 .summary { color: #374151; line-height: 1.7; font-size: 12px; }

//                                 .skills-table { width: 100%; border-collapse: collapse; }
//                                 .skills-table tr td { padding: 3px 0; vertical-align: top; font-size: 12px; }
//                                 .skills-table tr td:first-child { font-weight: 600; color: #1a1a2e; width: 140px; padding-right: 10px; }
//                                 .skills-table tr td:last-child { color: #374151; }

//                                 .item { margin-bottom: 12px; }
//                                 .item-header { display: flex; justify-content: space-between; align-items: baseline; }
//                                 .item-title { font-weight: 700; color: #1a1a2e; font-size: 13px; }
//                                 .item-date { color: #9CA3AF; font-size: 11px; white-space: nowrap; }
//                                 .item-sub { color: #4F46E5; font-size: 11.5px; margin: 2px 0 5px; font-style: italic; }
//                                 .item-stack { color: #6B7280; font-size: 11px; margin-bottom: 5px; }

//                                 ul { padding-left: 14px; }
//                                 ul li { color: #374151; font-size: 12px; margin-bottom: 3px; line-height: 1.5; }
//                                 ul li::marker { color: #4F46E5; }

//                                 .edu-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
//                                 .edu-left .edu-degree { font-weight: 600; color: #1a1a2e; font-size: 12.5px; }
//                                 .edu-left .edu-school { color: #6B7280; font-size: 11.5px; margin-top: 2px; }
//                                 .edu-right { text-align: right; color: #9CA3AF; font-size: 11px; }
//                             </style>
//                         </head>
//                         <body>

//                             <div class="header">
//                                 <div class="name">${resumeData.name || "Candidate"}</div>
//                                 <div class="role">Backend & Full Stack Developer</div>
//                                 <div class="contact">${[resumeData.location, resumeData.phone, resumeData.email].filter(Boolean).join("  |  ")}</div>
//                             </div>

//                             <div class="section">
//                                 <div class="section-title">Professional Summary</div>
//                                 <div class="summary">${resumeData.summary}</div>
//                             </div>

//                             <div class="section">
//                                 <div class="section-title">Skills & Core Competencies</div>
//                                 <table class="skills-table">
//                                     ${resumeData.skillCategories ? resumeData.skillCategories.map(cat => `
//                                     <tr>
//                                         <td>${cat.category}</td>
//                                         <td>${cat.skills}</td>
//                                     </tr>`).join("") : `<tr><td colspan="2">${resumeData.skills.join("  •  ")}</td></tr>`}
//                                 </table>
//                             </div>

//                             ${resumeData.experience && resumeData.experience.length > 0 ? `
//                             <div class="section">
//                                 <div class="section-title">Experience</div>
//                                 ${resumeData.experience.map(exp => `
//                                 <div class="item">
//                                     <div class="item-header">
//                                         <span class="item-title">${exp.role}</span>
//                                         <span class="item-date">${exp.duration}</span>
//                                     </div>
//                                     <div class="item-sub">${exp.company}</div>
//                                     ${exp.stack ? `<div class="item-stack">Stack: ${exp.stack}</div>` : ""}
//                                     <ul>${exp.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
//                                 </div>`).join("")}
//                             </div>` : ""}

//                             <div class="section">
//                                 <div class="section-title">Projects</div>
//                                 ${resumeData.projects.map(proj => `
//                                 <div class="item">
//                                     <div class="item-header">
//                                         <span class="item-title">${proj.name}</span>
//                                     </div>
//                                     <div class="item-stack">${proj.stack}</div>
//                                     <ul>${proj.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
//                                 </div>`).join("")}
//                             </div>

//                             <div class="section">
//                                 <div class="section-title">Education</div>
//                                 ${resumeData.education.map(edu => `
//                                 <div class="edu-row">
//                                     <div class="edu-left">
//                                         <div class="edu-degree">${edu.degree}</div>
//                                         <div class="edu-school">${edu.school}${edu.grade && edu.grade !== "N/A" ? "  |  " + edu.grade : ""}</div>
//                                     </div>
//                                     <div class="edu-right">${edu.year}</div>
//                                 </div>`).join("")}
//                             </div>

//                         </body>
//                     </html>
// `;













//         // Launch Puppeteer and generate PDF
//         const browser = await puppeteer.launch({
//             headless: "new",
//             executablePath: process.env.CHROME_PATH || 
//                 (process.platform === "win32" 
//                 ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
//                 : process.platform === "darwin"
//                 ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
//                 : "/usr/bin/google-chrome"),
//             args: ["--no-sandbox", "--disable-setuid-sandbox"]
//         });

//         const page = await browser.newPage();
//         await page.setContent(html, { waitUntil: "networkidle0" });

//         const pdfBuffer = await page.pdf({
//             format: "A4",
//             margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" },
//             printBackground: true
//         });

//         await browser.close();

//         res.set({
//             "Content-Type": "application/pdf",
//             "Content-Disposition": `attachment; filename="tailored_resume.pdf"`
//         });

//         res.send(pdfBuffer);

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

















// ─────────────────────────────────────────────────────────────
// PASTE THIS ENTIRE FUNCTION into interview.controller.js
// Replace your existing generateResumePdfController
// ─────────────────────────────────────────────────────────────

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

        // ── BUILD HTML ──────────────────────────────────────────

        // Contact row — same style as your CV header
        // const contactParts = [
        //     resumeData.location ? `<span>${resumeData.location}</span>` : '',
        //     resumeData.phone ? `<span>${resumeData.phone}</span>` : '',
        //     resumeData.email ? `<a href="mailto:${resumeData.email}">${resumeData.email}</a>` : '',
        //     resumeData.linkedin ? `<a href="${resumeData.linkedin}">LinkedIn</a>` : '',
        //     resumeData.github ? `<a href="${resumeData.github}">GitHub</a>` : '',
        //     resumeData.leetcode ? `<a href="${resumeData.leetcode}">LeetCode</a>` : '',
        //     resumeData.gfg ? `<a href="${resumeData.gfg}">GeeksforGeeks</a>` : '',
        //     resumeData.portfolio ? `<a href="${resumeData.portfolio}">Portfolio</a>` : '',
        // ].filter(Boolean).join(' | ');


        const links = report.links || {};

        const contactParts = [
            resumeData.location ? `<span>${resumeData.location}</span>` : '',
            resumeData.phone ? `<span>${resumeData.phone}</span>` : '',
            resumeData.email ? `<a href="mailto:${resumeData.email}">${resumeData.email}</a>` : '',
            links.linkedin ? `<a href="${links.linkedin}">LinkedIn</a>` : '',
            links.github ? `<a href="${links.github}">GitHub</a>` : '',
            links.leetcode ? `<a href="${links.leetcode}">LeetCode</a>` : '',
            links.gfg ? `<a href="${links.gfg}">GeeksforGeeks</a>` : '',
            links.portfolio ? `<a href="${links.portfolio}">Portfolio</a>` : '',
            ...(links.extraLinks || []).map(l => l.url ? `<a href="${l.url}">${l.label}</a>` : ''),
        ].filter(Boolean).join(' | ');
        

        // Skills — if skillCategories exist use table, else flat list
        const skillsHTML = resumeData.skillCategories?.length
            ? `<table class="skills-table">
                ${resumeData.skillCategories.map(cat => `
                <tr>
                    <td class="skill-cat">${cat.category}</td>
                    <td class="skill-val">${cat.skills}</td>
                </tr>`).join('')}
               </table>`
            : `<div class="skills-flat">${(resumeData.skills || []).join('  •  ')}</div>`;

        // Certifications
        const certHTML = resumeData.certifications?.length
            ? `<div class="section">
                <div class="section-title">C E R T I F I C A T I O N S</div>
                ${resumeData.certifications.map(c => `
                <div class="exp-item">
                    <div class="exp-header">
                        <span class="exp-role">${c.name}</span>
                        <span class="exp-date">${c.date || ''}</span>
                    </div>
                    ${c.issuer ? `<div class="exp-sub">Issued by ${c.issuer}${c.link ? ` | <a href="${c.link}">View Certificate</a>` : ''}</div>` : ''}
                </div>`).join('')}
               </div>`
            : '';

        // Experience
        const experienceHTML = resumeData.experience?.length
            ? `<div class="section">
                <div class="section-title">E X P E R I E N C E</div>
                ${resumeData.experience.map(exp => `
                <div class="exp-item">
                    <div class="exp-header">
                        <span class="exp-role">${exp.role} | ${exp.company}</span>
                        <span class="exp-date">${exp.duration}</span>
                    </div>
                    ${exp.stack ? `<div class="exp-sub">Stack: ${exp.stack}</div>` : ''}
                    <ul>${exp.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
                </div>`).join('')}
               </div>`
            : '';

        // Projects
        const projectsHTML = resumeData.projects?.length
            ? `<div class="section">
                <div class="section-title">P R O J E C T S</div>
                ${resumeData.projects.map(proj => `
                <div class="exp-item">
                    <div class="exp-header">
                        <span class="exp-role">${proj.name}${proj.link ? (() => {
                            const url = proj.link.startsWith('http') ? proj.link : `https://${proj.link}`;
                            return ` | <a href="${url}" class="proj-link">${proj.link}</a>`;
                            })() : ''}
                        </span>
                        ${proj.date ? `<span class="exp-date">${proj.date}</span>` : ''}
                    </div>
                    <div class="exp-sub">${proj.stack}</div>
                    <ul>${proj.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
                </div>`).join('')}
               </div>`
            : '';

        // Education
        const educationHTML = resumeData.education?.length
            ? `<div class="section">
                <div class="section-title">E D U C A T I O N</div>
                ${resumeData.education.map(edu => `
                <div class="edu-item">
                    <div class="edu-left">
                        <div class="edu-degree">${edu.degree}</div>
                        <div class="edu-school">${edu.school}${edu.grade && edu.grade !== 'N/A' ? '  |  ' + edu.grade : ''}</div>
                    </div>
                    <div class="edu-right">${edu.year}</div>
                </div>`).join('')}
               </div>`
            : '';

        // Additional info
        const additionalHTML = resumeData.additional
            ? `<div class="section">
                <div class="section-title">A D D I T I O N A L &nbsp; I N F O R M A T I O N</div>
                <div class="additional-text">${resumeData.additional}</div>
               </div>`
            : '';

        // ── FINAL HTML ──────────────────────────────────────────
        const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
        font-family: 'Segoe UI', 'Calibri', Arial, sans-serif;
        font-size: 11.5px;
        color: #1a1a1a;
        line-height: 1.5;
        background: #fff;
    }

    /* ── HEADER ── */
    .header {
        text-align: center;
        padding-bottom: 10px;
        margin-bottom: 14px;
    }

    .name {
        font-size: 27px;
        font-weight: 700;
        letter-spacing: 3px;
        color: #1a1a1a;
        text-transform: uppercase;
        margin-bottom: 3px;
    }

    .role-title {
        font-size: 12px;
        color: #444;
        margin-bottom: 5px;
    }

    .contact {
        font-size: 10.5px;
        color: #333;
        line-height: 1.8;
    }

    .contact a {
        color: #1a1a1a;
        text-decoration: none;
    }

    /* ── SECTION ── */
    .section {
        margin-bottom: 13px;
    }

    .section-title {
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 2.5px;
        color: #1a1a1a;
        text-transform: uppercase;
        border-bottom: 1px solid #1a1a1a;
        padding-bottom: 3px;
        margin-bottom: 8px;
    }

    /* ── SUMMARY ── */
    .summary-text {
        font-size: 11px;
        line-height: 1.7;
        color: #222;
    }

    /* ── SKILLS ── */
    .skills-table {
        width: 100%;
        border-collapse: collapse;
    }

    .skills-table tr td {
        padding: 2px 0;
        vertical-align: top;
        font-size: 11px;
        line-height: 1.5;
    }

    .skill-cat {
        font-weight: 600;
        color: #1a1a1a;
        width: 130px !important;
        padding-right: 8px !important;
    }

    .skill-val { color: #333; }

    .skills-flat {
        font-size: 11px;
        color: #333;
        line-height: 1.7;
    }

    /* ── EXPERIENCE / PROJECTS / CERTS ── */
    .exp-item {
        margin-bottom: 10px;
    }

    .exp-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 2px;
        gap: 8px;
    }

    .exp-role {
        font-weight: 700;
        font-size: 11.5px;
        color: #1a1a1a;
        flex: 1;
    }

    .exp-date {
        font-size: 10.5px;
        color: #555;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .exp-sub {
        font-size: 10.5px;
        color: #555;
        font-style: italic;
        margin-bottom: 4px;
    }

    .proj-link {
        font-weight: 400 !important;
        font-size: 10.5px;
        color: #1a1a1a !important;
    }

    /* ── BULLETS ── */
    ul {
        padding-left: 0;
        margin-top: 3px;
        list-style: none;
    }

    ul li {
        font-size: 11px;
        color: #222;
        margin-bottom: 2.5px;
        line-height: 1.55;
        padding-left: 14px;
        position: relative;
    }

    ul li::before {
        content: "▸";
        position: absolute;
        left: 0;
        color: #333;
        font-size: 9px;
        top: 1.5px;
    }

    /* ── EDUCATION ── */
    .edu-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 6px;
        gap: 8px;
    }

    .edu-degree {
        font-weight: 600;
        font-size: 11.5px;
        color: #1a1a1a;
    }

    .edu-school {
        font-size: 10.5px;
        color: #555;
        margin-top: 1px;
    }

    .edu-right {
        font-size: 10.5px;
        color: #555;
        white-space: nowrap;
        flex-shrink: 0;
        text-align: right;
    }

    /* ── ADDITIONAL ── */
    .additional-text {
        font-size: 11px;
        color: #333;
        line-height: 1.65;
    }

    a { color: #1a1a1a; text-decoration: none; }
</style>
</head>
<body>

<div class="header">
    <div class="name">${resumeData.name || 'Candidate'}</div>
    <div class="role-title">Backend &amp; Full Stack Developer</div>
    <div class="contact">${contactParts}</div>
</div>

<div class="section">
    <div class="section-title">P R O F E S S I O N A L &nbsp; S U M M A R Y</div>
    <div class="summary-text">${resumeData.summary || ''}</div>
</div>

<div class="section">
    <div class="section-title">S K I L L S &nbsp; &amp; &nbsp; C O R E &nbsp; C O M P E T E N C I E S</div>
    ${skillsHTML}
</div>

${certHTML}
${experienceHTML}
${projectsHTML}
${educationHTML}
${additionalHTML}

</body>
</html>`;

        // ── PUPPETEER → PDF ─────────────────────────────────────
        const browser = await puppeteer.launch({
            headless: "new",
            executablePath: process.env.CHROME_PATH ||
                (process.platform === "win32"
                    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
                    : process.platform === "darwin"
                    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
                    : "/usr/bin/google-chrome"),
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            margin: { top: "14mm", bottom: "14mm", left: "16mm", right: "16mm" },
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