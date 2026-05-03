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










// ─────────────────────────────────────────────────────────────
// generate pdf...
// ─────────────────────────────────────────────────────────────

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

//         // ── BUILD HTML ──────────────────────────────────────────

//         const links = report.links || {};

//         const contactParts = [
//             resumeData.location ? `<span>${resumeData.location}</span>` : '',
//             resumeData.phone ? `<span>${resumeData.phone}</span>` : '',
//             resumeData.email ? `<a href="mailto:${resumeData.email}">${resumeData.email}</a>` : '',
//             links.linkedin ? `<a href="${links.linkedin}">LinkedIn</a>` : '',
//             links.github ? `<a href="${links.github}">GitHub</a>` : '',
//             links.leetcode ? `<a href="${links.leetcode}">LeetCode</a>` : '',
//             links.gfg ? `<a href="${links.gfg}">GeeksforGeeks</a>` : '',
//             links.portfolio ? `<a href="${links.portfolio}">Portfolio</a>` : '',
//             ...(links.extraLinks || []).map(l => l.url ? `<a href="${l.url}">${l.label}</a>` : ''),
//         ].filter(Boolean).join(' | ');
        

//         // Skills — if skillCategories exist use table, else flat list
//         const skillsHTML = resumeData.skillCategories?.length
//             ? `<table class="skills-table">
//                 ${resumeData.skillCategories.map(cat => `
//                 <tr>
//                     <td class="skill-cat">${cat.category}</td>
//                     <td class="skill-val">${cat.skills}</td>
//                 </tr>`).join('')}
//                </table>`
//             : `<div class="skills-flat">${(resumeData.skills || []).join('  •  ')}</div>`;

//         // Certifications
//         const certHTML = resumeData.certifications?.length
//             ? `<div class="section">
//                 <div class="section-title">C E R T I F I C A T I O N S</div>
//                 ${resumeData.certifications.map(c => `
//                 <div class="exp-item">
//                     <div class="exp-header">
//                         <span class="exp-role">${c.name}</span>
//                         <span class="exp-date">${c.date || ''}</span>
//                     </div>
//                     ${c.issuer ? `<div class="exp-sub">Issued by ${c.issuer}${c.link ? ` | <a href="${c.link}">View Certificate</a>` : ''}</div>` : ''}
//                 </div>`).join('')}
//                </div>`
//             : '';

//         // Experience
//         const experienceHTML = resumeData.experience?.length
//             ? `<div class="section">
//                 <div class="section-title">E X P E R I E N C E</div>
//                 ${resumeData.experience.map(exp => `
//                 <div class="exp-item">
//                     <div class="exp-header">
//                         <span class="exp-role">${exp.role} | ${exp.company}</span>
//                         <span class="exp-date">${exp.duration}</span>
//                     </div>
//                     ${exp.stack ? `<div class="exp-sub">Stack: ${exp.stack}</div>` : ''}
//                     <ul>${exp.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
//                 </div>`).join('')}
//                </div>`
//             : '';

//         // Projects
//         const projectsHTML = resumeData.projects?.length
//             ? `<div class="section">
//                 <div class="section-title">P R O J E C T S</div>
//                 ${resumeData.projects.map(proj => `
//                 <div class="exp-item">
//                     <div class="exp-header">
//                         <span class="exp-role">${proj.name}${proj.link ? (() => {
//                             const url = proj.link.startsWith('http') ? proj.link : `https://${proj.link}`;
//                             return ` | <a href="${url}" class="proj-link">${proj.link}</a>`;
//                             })() : ''}
//                         </span>
//                         ${proj.date ? `<span class="exp-date">${proj.date}</span>` : ''}
//                     </div>
//                     <div class="exp-sub">${proj.stack}</div>
//                     <ul>${proj.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
//                 </div>`).join('')}
//                </div>`
//             : '';

//         // Education
//         const educationHTML = resumeData.education?.length
//             ? `<div class="section">
//                 <div class="section-title">E D U C A T I O N</div>
//                 ${resumeData.education.map(edu => `
//                 <div class="edu-item">
//                     <div class="edu-left">
//                         <div class="edu-degree">${edu.degree}</div>
//                         <div class="edu-school">${edu.school}${edu.grade && edu.grade !== 'N/A' ? '  |  ' + edu.grade : ''}</div>
//                     </div>
//                     <div class="edu-right">${edu.year}</div>
//                 </div>`).join('')}
//                </div>`
//             : '';

//         // Additional info
//         const additionalHTML = resumeData.additional
//             ? `<div class="section">
//                 <div class="section-title">A D D I T I O N A L &nbsp; I N F O R M A T I O N</div>
//                 <div class="additional-text">${resumeData.additional}</div>
//                </div>`
//             : '';

//         // ── FINAL HTML ──────────────────────────────────────────
//         const html = `<!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8">
// <style>
//     * { margin: 0; padding: 0; box-sizing: border-box; }

//     body {
//         font-family: 'Segoe UI', 'Calibri', Arial, sans-serif;
//         font-size: 11.5px;
//         color: #1a1a1a;
//         line-height: 1.5;
//         background: #fff;
//     }

//     /* ── HEADER ── */
//     .header {
//         text-align: center;
//         padding-bottom: 10px;
//         margin-bottom: 14px;
//     }

//     .name {
//         font-size: 27px;
//         font-weight: 700;
//         letter-spacing: 3px;
//         color: #1a1a1a;
//         text-transform: uppercase;
//         margin-bottom: 3px;
//     }

//     .role-title {
//         font-size: 12px;
//         color: #444;
//         margin-bottom: 5px;
//     }

//     .contact {
//         font-size: 10.5px;
//         color: #333;
//         line-height: 1.8;
//     }

//     .contact a {
//         color: #1a1a1a;
//         text-decoration: none;
//     }

//     /* ── SECTION ── */
//     .section {
//         margin-bottom: 13px;
//     }

//     .section-title {
//         font-size: 9.5px;
//         font-weight: 700;
//         letter-spacing: 2.5px;
//         color: #1a1a1a;
//         text-transform: uppercase;
//         border-bottom: 1px solid #1a1a1a;
//         padding-bottom: 3px;
//         margin-bottom: 8px;
//     }

//     /* ── SUMMARY ── */
//     .summary-text {
//         font-size: 11px;
//         line-height: 1.7;
//         color: #222;
//     }

//     /* ── SKILLS ── */
//     .skills-table {
//         width: 100%;
//         border-collapse: collapse;
//     }

//     .skills-table tr td {
//         padding: 2px 0;
//         vertical-align: top;
//         font-size: 11px;
//         line-height: 1.5;
//     }

//     .skill-cat {
//         font-weight: 600;
//         color: #1a1a1a;
//         width: 130px !important;
//         padding-right: 8px !important;
//     }

//     .skill-val { color: #333; }

//     .skills-flat {
//         font-size: 11px;
//         color: #333;
//         line-height: 1.7;
//     }

//     /* ── EXPERIENCE / PROJECTS / CERTS ── */
//     .exp-item {
//         margin-bottom: 10px;
//     }

//     .exp-header {
//         display: flex;
//         justify-content: space-between;
//         align-items: baseline;
//         margin-bottom: 2px;
//         gap: 8px;
//     }

//     .exp-role {
//         font-weight: 700;
//         font-size: 11.5px;
//         color: #1a1a1a;
//         flex: 1;
//     }

//     .exp-date {
//         font-size: 10.5px;
//         color: #555;
//         white-space: nowrap;
//         flex-shrink: 0;
//     }

//     .exp-sub {
//         font-size: 10.5px;
//         color: #555;
//         font-style: italic;
//         margin-bottom: 4px;
//     }

//     .proj-link {
//         font-weight: 400 !important;
//         font-size: 10.5px;
//         color: #1a1a1a !important;
//     }

//     /* ── BULLETS ── */
//     ul {
//         padding-left: 0;
//         margin-top: 3px;
//         list-style: none;
//     }

//     ul li {
//         font-size: 11px;
//         color: #222;
//         margin-bottom: 2.5px;
//         line-height: 1.55;
//         padding-left: 14px;
//         position: relative;
//     }

//     ul li::before {
//         content: "▸";
//         position: absolute;
//         left: 0;
//         color: #333;
//         font-size: 9px;
//         top: 1.5px;
//     }

//     /* ── EDUCATION ── */
//     .edu-item {
//         display: flex;
//         justify-content: space-between;
//         align-items: flex-start;
//         margin-bottom: 6px;
//         gap: 8px;
//     }

//     .edu-degree {
//         font-weight: 600;
//         font-size: 11.5px;
//         color: #1a1a1a;
//     }

//     .edu-school {
//         font-size: 10.5px;
//         color: #555;
//         margin-top: 1px;
//     }

//     .edu-right {
//         font-size: 10.5px;
//         color: #555;
//         white-space: nowrap;
//         flex-shrink: 0;
//         text-align: right;
//     }

//     /* ── ADDITIONAL ── */
//     .additional-text {
//         font-size: 11px;
//         color: #333;
//         line-height: 1.65;
//     }

//     a { color: #1a1a1a; text-decoration: none; }
// </style>
// </head>
// <body>

// <div class="header">
//     <div class="name">${resumeData.name || 'Candidate'}</div>
//     <div class="role-title">Backend &amp; Full Stack Developer</div>
//     <div class="contact">${contactParts}</div>
// </div>

// <div class="section">
//     <div class="section-title">P R O F E S S I O N A L &nbsp; S U M M A R Y</div>
//     <div class="summary-text">${resumeData.summary || ''}</div>
// </div>

// <div class="section">
//     <div class="section-title">S K I L L S &nbsp; &amp; &nbsp; C O R E &nbsp; C O M P E T E N C I E S</div>
//     ${skillsHTML}
// </div>

// ${certHTML}
// ${experienceHTML}
// ${projectsHTML}
// ${educationHTML}
// ${additionalHTML}

// </body>
// </html>`;

//         // ── PUPPETEER → PDF ─────────────────────────────────────
//         const browser = await puppeteer.launch({
//             headless: "new",
//             executablePath: process.env.CHROME_PATH ||
//                 (process.platform === "win32"
//                     ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
//                     : process.platform === "darwin"
//                     ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
//                     : "/usr/bin/google-chrome"),
//             args: ["--no-sandbox", "--disable-setuid-sandbox"]
//         });

//         const page = await browser.newPage();
//         await page.setContent(html, { waitUntil: "networkidle0" });

//         const pdfBuffer = await page.pdf({
//             format: "A4",
//             margin: { top: "14mm", bottom: "14mm", left: "16mm", right: "16mm" },
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






























// async function generateResumePdfController(req, res) {
//     try {
//         const puppeteer = require("puppeteer-core");

//         const report = await interviewReportModel.findOne({
//             _id: req.params.reportId,
//             user: req.user.id
//         });

//         if (!report) {
//             return res.status(404).json({ success: false, message: "Report not found" });
//         }

//         const resumeData = await generateResumeContent({
//             resume: report.resume,
//             jobDescription: report.jobDescription,
//             selfDescription: report.selfDescription
//         });

//         const safeUrl = (url) => {
//             if (!url) return '';
//             return url.startsWith('http') ? url : `https://${url}`;
//         };

//         const links = report.links || {};
//         const contactParts = [
//             resumeData.location ? `<span>${resumeData.location}</span>` : '',
//             resumeData.phone   ? `<span>${resumeData.phone}</span>` : '',
//             resumeData.email   ? `<a href="mailto:${resumeData.email}">${resumeData.email}</a>` : '',
//             links.linkedin  ? `<a href="${safeUrl(links.linkedin)}">LinkedIn</a>` : '',
//             links.github    ? `<a href="${safeUrl(links.github)}">GitHub</a>` : '',
//             links.leetcode  ? `<a href="${safeUrl(links.leetcode)}">LeetCode</a>` : '',
//             links.gfg       ? `<a href="${safeUrl(links.gfg)}">GeeksforGeeks</a>` : '',
//             links.portfolio ? `<a href="${safeUrl(links.portfolio)}">Portfolio</a>` : '',
//             ...((links.extraLinks || []).map(l => l.url ? `<a href="${safeUrl(l.url)}">${l.label}</a>` : '')),
//         ].filter(Boolean).join(' | ');

//         const skillsHTML = resumeData.skillCategories?.length
//             ? `<table class="st">${resumeData.skillCategories.map(c => `<tr><td class="sc">${c.category}</td><td class="sv">${c.skills}</td></tr>`).join('')}</table>`
//             : `<div style="font-size:10.5px;color:#333;line-height:1.6">${(resumeData.skills||[]).join('  •  ')}</div>`;

//         const certHTML = (resumeData.certifications||[]).length ? `
// <div class="sec"><div class="st2">C E R T I F I C A T I O N S</div>
// ${resumeData.certifications.map(c=>`<div class="blk"><div class="bh"><span class="bt">${c.name}</span><span class="bd">${c.date||''}</span></div>${c.issuer?`<div class="bs">Issued by ${c.issuer}${c.link?` | <a href="${safeUrl(c.link)}">View Certificate</a>`:''}</div>`:''}</div>`).join('')}</div>` : '';

//         const expHTML = (resumeData.experience||[]).length ? `
// <div class="sec"><div class="st2">E X P E R I E N C E</div>
// ${resumeData.experience.map(e=>`<div class="blk"><div class="bh"><span class="bt">${e.role} | ${e.company}</span><span class="bd">${e.duration}</span></div>${e.stack?`<div class="bs">Stack: ${e.stack}</div>`:''}<ul>${e.bullets.map(b=>`<li>${b}</li>`).join('')}</ul></div>`).join('')}</div>` : '';

//         const projHTML = (resumeData.projects||[]).length ? `
// <div class="sec"><div class="st2">P R O J E C T S</div>
// ${resumeData.projects.map(p=>`<div class="blk"><div class="bh"><span class="bt">${p.name}${p.link?` | <a href="${safeUrl(p.link)}" class="pl">${p.link}</a>`:''}</span>${p.date?`<span class="bd">${p.date}</span>`:''}</div><div class="bs">${p.stack}</div><ul>${p.bullets.map(b=>`<li>${b}</li>`).join('')}</ul></div>`).join('')}</div>` : '';

//         const eduHTML = (resumeData.education||[]).length ? `
// <div class="sec"><div class="st2">E D U C A T I O N</div>
// ${resumeData.education.map(e=>`<div class="er"><div class="el"><div class="ed">${e.degree}</div><div class="es">${e.school}${e.grade&&e.grade!=='N/A'?' | '+e.grade:''}</div></div><div class="ey">${e.year}</div></div>`).join('')}</div>` : '';

//         const addHTML = resumeData.additional ? `
// <div class="sec"><div class="st2">A D D I T I O N A L &nbsp; I N F O R M A T I O N</div><div style="font-size:10.5px;color:#333;line-height:1.65">${resumeData.additional}</div></div>` : '';

//         const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
// *{margin:0;padding:0;box-sizing:border-box}
// body{font-family:'Segoe UI',Calibri,Arial,sans-serif;font-size:11px;color:#1c1c1e;line-height:1.55;background:#fff}
// .hdr{text-align:center;padding-bottom:10px;margin-bottom:12px;border-bottom:1.5px solid #1c1c1e}
// .nm{font-size:24px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#1c1c1e;margin-bottom:2px}
// .rl{font-size:11px;color:#444;margin-bottom:5px}
// .ct{font-size:10px;color:#333}
// .ct a{color:#1c1c1e;text-decoration:none}
// .sec{margin-bottom:12px}
// .st2{font-size:8.5px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#1c1c1e;border-bottom:1px solid #1c1c1e;padding-bottom:2px;margin-bottom:7px}
// .sum{font-size:10.5px;color:#222;line-height:1.7}
// .st{width:100%;border-collapse:collapse}
// .st tr td{padding:1.5px 0;vertical-align:top;font-size:10.5px;line-height:1.5}
// .sc{font-weight:600;color:#1c1c1e;width:120px;padding-right:6px;white-space:nowrap}
// .sv{color:#2d2d2d}
// .blk{margin-bottom:9px}
// .bh{display:flex;justify-content:space-between;align-items:baseline;gap:6px;margin-bottom:1.5px}
// .bt{font-weight:700;font-size:11px;color:#1c1c1e;flex:1;line-height:1.4}
// .bd{font-size:10px;color:#555;white-space:nowrap;flex-shrink:0}
// .bs{font-size:10px;color:#555;font-style:italic;margin-bottom:3px}
// .pl{font-weight:400;font-size:10px;color:#1c1c1e;text-decoration:none}
// ul{list-style:none;padding:0;margin:2px 0 0 0}
// ul li{font-size:10.5px;color:#222;line-height:1.55;margin-bottom:2px;padding-left:12px;position:relative}
// ul li::before{content:"▸";position:absolute;left:0;top:1px;font-size:8px;color:#444}
// .er{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;gap:6px}
// .ed{font-weight:600;font-size:11px;color:#1c1c1e}
// .es{font-size:10px;color:#555;margin-top:1px}
// .ey{font-size:10px;color:#555;white-space:nowrap;flex-shrink:0;text-align:right}
// a{color:#1c1c1e;text-decoration:none}
// </style></head><body>
// <div class="hdr">
//   <div class="nm">${resumeData.name||'Candidate'}</div>
//   <div class="rl">${resumeData.roleTitle||'Backend & Full Stack Developer'}</div>
//   <div class="ct">${contactParts}</div>
// </div>
// <div class="sec"><div class="st2">P R O F E S S I O N A L &nbsp; S U M M A R Y</div><div class="sum">${resumeData.summary||''}</div></div>
// <div class="sec"><div class="st2">S K I L L S &nbsp; &amp; &nbsp; C O R E &nbsp; C O M P E T E N C I E S</div>${skillsHTML}</div>
// ${certHTML}${expHTML}${projHTML}${eduHTML}${addHTML}
// </body></html>`;

//         const browser = await puppeteer.launch({
//             headless: "new",
//             executablePath: process.env.CHROME_PATH ||
//                 (process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
//                 : process.platform === "darwin" ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
//                 : "/usr/bin/google-chrome"),
//             args: ["--no-sandbox", "--disable-setuid-sandbox"]
//         });

//         const page = await browser.newPage();
//         await page.setContent(html, { waitUntil: "networkidle0" });
//         const pdfBuffer = await page.pdf({
//             format: "A4",
//             margin: { top: "14mm", bottom: "14mm", left: "15mm", right: "15mm" },
//             printBackground: true
//         });
//         await browser.close();

//         res.set({
//             "Content-Type": "application/pdf",
//             "Content-Disposition": `attachment; filename="tailored_resume.pdf"`
//         });
//         res.send(pdfBuffer);

//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// }







































// async function generateResumePdfController(req, res) {
//     try {
//         const puppeteer = require("puppeteer-core");
 
//         const report = await interviewReportModel.findOne({
//             _id: req.params.reportId,
//             user: req.user.id
//         });
 
//         if (!report) {
//             return res.status(404).json({ success: false, message: "Report not found" });
//         }
 
//         const resumeData = await generateResumeContent({
//             resume: report.resume,
//             jobDescription: report.jobDescription,
//             selfDescription: report.selfDescription
//         });
 
//         const safe = (url) => (!url ? '' : url.startsWith('http') ? url : `https://${url}`);
//         const links = report.links || {};
 
//         // ── CONTACT LINE
//         const contactParts = [
//             resumeData.location ? `<span class="ci">${resumeData.location}</span>` : '',
//             resumeData.phone    ? `<span class="ci">${resumeData.phone}</span>` : '',
//             resumeData.email    ? `<a class="ci" href="mailto:${resumeData.email}">${resumeData.email}</a>` : '',
//             links.linkedin  ? `<a class="ci" href="${safe(links.linkedin)}">LinkedIn</a>` : '',
//             links.github    ? `<a class="ci" href="${safe(links.github)}">GitHub</a>` : '',
//             links.leetcode  ? `<a class="ci" href="${safe(links.leetcode)}">LeetCode</a>` : '',
//             links.gfg       ? `<a class="ci" href="${safe(links.gfg)}">GeeksforGeeks</a>` : '',
//             links.portfolio ? `<a class="ci" href="${safe(links.portfolio)}">Portfolio</a>` : '',
//             ...((links.extraLinks || []).map(l => l.url ? `<a class="ci" href="${safe(l.url)}">${l.label || l.url}</a>` : '')),
//         ].filter(Boolean).join('<span class="sep">|</span>');
 
//         // ── SKILLS
//         const skillsHTML = resumeData.skillCategories?.length
//             ? resumeData.skillCategories.map(c => `
//               <div class="sk-row">
//                 <span class="sk-cat">${c.category}</span>
//                 <span class="sk-val">${c.skills}</span>
//               </div>`).join('')
//             : `<div class="sk-flat">${(resumeData.skills || []).join(' &bull; ')}</div>`;
 
//         // ── CERTIFICATIONS
//         const certHTML = (resumeData.certifications || []).length ? `
// <div class="sec">
//   <div class="sec-hd"><span class="sec-line"></span><span class="sec-title">Certifications</span><span class="sec-line"></span></div>
//   ${resumeData.certifications.map(c => `
//   <div class="item">
//     <div class="item-top">
//       <span class="item-title">${c.name}</span>
//       <span class="item-date">${c.date || ''}</span>
//     </div>
//     ${c.issuer ? `<div class="item-sub">Issued by ${c.issuer}${c.link ? ` &nbsp;&bull;&nbsp; <a href="${safe(c.link)}" class="lnk">View Certificate</a>` : ''}</div>` : ''}
//   </div>`).join('')}
// </div>` : '';
 
//         // ── EXPERIENCE
//         const expHTML = (resumeData.experience || []).length ? `
// <div class="sec">
//   <div class="sec-hd"><span class="sec-line"></span><span class="sec-title">Experience</span><span class="sec-line"></span></div>
//   ${resumeData.experience.map(e => `
//   <div class="item">
//     <div class="item-top">
//       <div>
//         <span class="item-title">${e.role}</span>
//         <span class="item-company"> &bull; ${e.company}${e.location ? ` &mdash; ${e.location}` : ''}</span>
//       </div>
//       <span class="item-date">${e.duration}</span>
//     </div>
//     ${e.stack ? `<div class="item-sub"><span class="tag-label">Stack:</span> ${e.stack}</div>` : ''}
//     <ul>${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
//   </div>`).join('')}
// </div>` : '';
 
//         // ── PROJECTS
//         const projHTML = (resumeData.projects || []).length ? `
// <div class="sec">
//   <div class="sec-hd"><span class="sec-line"></span><span class="sec-title">Projects</span><span class="sec-line"></span></div>
//   ${resumeData.projects.map(p => `
//   <div class="item">
//     <div class="item-top">
//       <div>
//         <span class="item-title">${p.name}</span>
//         ${p.role ? `<span class="item-company"> &bull; ${p.role}</span>` : ''}
//         ${p.link ? `<a href="${safe(p.link)}" class="proj-lnk">${p.link.replace(/^https?:\/\//, '')}</a>` : ''}
//       </div>
//       ${p.date ? `<span class="item-date">${p.date}</span>` : ''}
//     </div>
//     ${p.stack ? `<div class="item-sub"><span class="tag-label">Stack:</span> ${p.stack}</div>` : ''}
//     <ul>${p.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
//   </div>`).join('')}
// </div>` : '';
 
//         // ── EDUCATION
//         const eduHTML = (resumeData.education || []).length ? `
// <div class="sec">
//   <div class="sec-hd"><span class="sec-line"></span><span class="sec-title">Education</span><span class="sec-line"></span></div>
//   ${resumeData.education.map(e => `
//   <div class="edu-row">
//     <div class="edu-left">
//       <div class="edu-deg">${e.degree}</div>
//       <div class="edu-sch">${e.school}${e.grade && e.grade !== 'N/A' ? ` &nbsp;&bull;&nbsp; ${e.grade}` : ''}</div>
//     </div>
//     <div class="edu-yr">${e.year}</div>
//   </div>`).join('')}
// </div>` : '';
 
//         // ── ADDITIONAL
//         const addHTML = resumeData.additional ? `
// <div class="sec">
//   <div class="sec-hd"><span class="sec-line"></span><span class="sec-title">Additional Information</span><span class="sec-line"></span></div>
//   <div class="add-txt">${resumeData.additional}</div>
// </div>` : '';
 
//         const roleTitle = resumeData.roleTitle || resumeData.title || 'Backend &amp; Full Stack Developer';
 
//         // ────────────────────────────────────────────────────────
//         //  MODERN BLUE-ACCENT TEMPLATE
//         //  Inspired by top FAANG-ready resumes
//         //  Accent: #1a56db (professional blue), clean white bg
//         // ────────────────────────────────────────────────────────
//         const html = `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8">
// <style>
 
// /* ─── RESET ──────────────────────────────────────────── */
// *{margin:0;padding:0;box-sizing:border-box}
 
// /* ─── BASE ───────────────────────────────────────────── */
// body{
//   font-family:'Segoe UI',Calibri,'Helvetica Neue',Arial,sans-serif;
//   font-size:10.5px;
//   color:#1e1e2d;
//   line-height:1.55;
//   background:#fff;
// }
// a{color:#1a56db;text-decoration:none}
// a:hover{text-decoration:underline}
 
// /* ─── HEADER ─────────────────────────────────────────── */
// .hdr{
//   display:flex;
//   flex-direction:column;
//   align-items:center;
//   padding:0 0 14px 0;
//   margin-bottom:14px;
//   border-bottom:2px solid #18191c;
//   position:relative;
// }
// .hdr::after{
//   content:'';
//   display:block;
//   width:60px;
//   height:3px;
//   background:#1a56db;
//   border-radius:2px;
//   position:absolute;
//   bottom:-3px;
//   left:50%;
//   transform:translateX(-50%);
// }
 
// .nm{
//   font-size:26px;
//   font-weight:700;
//   letter-spacing:2.5px;
//   text-transform:uppercase;
//   color:#0f172a;
//   margin-bottom:3px;
//   font-family:'Segoe UI',Calibri,Arial,sans-serif;
// }
// .rt{
//   font-size:11px;
//   font-weight:600;
//   color:#1a56db;
//   letter-spacing:0.5px;
//   margin-bottom:7px;
//   text-transform:uppercase;
// }
// .ct{
//   display:flex;
//   flex-wrap:wrap;
//   justify-content:center;
//   gap:0;
//   font-size:9.5px;
//   color:#374151;
// }
// .ci{color:#374151}
// .ci a{color:#1a56db}
// .sep{
//   margin:0 6px;
//   color:#9ca3af;
// }
 
// /* ─── SECTIONS ───────────────────────────────────────── */
// .sec{margin-bottom:13px}
 
// .sec-hd{
//   display:flex;
//   align-items:center;
//   gap:8px;
//   margin-bottom:8px;
// }
// .sec-title{
//   font-size:9px;
//   font-weight:800;
//   letter-spacing:2.5px;
//   text-transform:uppercase;
//   color:#1a56db;
//   white-space:nowrap;
// }
// .sec-line{
//   flex:1;
//   height:1px;
//   background:linear-gradient(90deg, #1b1c1e, #2b2e31);
// }
 
// /* ─── SUMMARY ────────────────────────────────────────── */
// .sum{
//   font-size:10.5px;
//   color:#1e1e2d;
//   line-height:1.72;
// }
 
// /* ─── SKILLS ─────────────────────────────────────────── */
// .sk-row{
//   display:flex;
//   gap:0;
//   align-items:baseline;
//   margin-bottom:3px;
// }
// .sk-cat{
//   font-weight:700;
//   font-size:10px;
//   color:#0f172a;
//   width:130px;
//   flex-shrink:0;
//   padding-right:8px;
// }
// .sk-val{
//   font-size:10px;
//   color:#374151;
//   flex:1;
// }
// .sk-flat{font-size:10.5px;color:#374151;line-height:1.7}
 
// /* ─── ITEMS (exp / proj / cert) ──────────────────────── */
// .item{margin-bottom:10px}
 
// .item-top{
//   display:flex;
//   justify-content:space-between;
//   align-items:flex-start;
//   gap:6px;
//   margin-bottom:1.5px;
// }
// .item-title{
//   font-size:11px;
//   font-weight:700;
//   color:#0f172a;
// }
// .item-company{
//   font-size:10.5px;
//   font-weight:400;
//   color:#374151;
// }
// .item-date{
//   font-size:9.5px;
//   color:#6b7280;
//   white-space:nowrap;
//   flex-shrink:0;
//   background:#eff6ff;
//   border:1px solid #5e95d8;
//   border-radius:4px;
//   padding:1px 6px;
// }
// .item-sub{
//   font-size:9.8px;
//   color:#6b7280;
//   font-style:italic;
//   margin-bottom:3px;
// }
// .tag-label{
//   font-weight:600;
//   font-style:normal;
//   color:#1a56db;
// }
// .proj-lnk{
//   font-size:9.5px;
//   color:#1a56db;
//   font-weight:400;
//   margin-left:6px;
// }
// .lnk{color:#1a56db}
 
// /* ─── BULLETS ────────────────────────────────────────── */
// ul{list-style:none;padding:0;margin:3px 0 0 0}
// ul li{
//   font-size:10.3px;
//   color:#1e1e2d;
//   line-height:1.58;
//   margin-bottom:2px;
//   padding-left:14px;
//   position:relative;
// }
// ul li::before{
//   content:'';
//   position:absolute;
//   left:3px;
//   top:7px;
//   width:4px;
//   height:4px;
//   border-radius:50%;
//   background:#1a56db;
// }
 
// /* ─── EDUCATION ──────────────────────────────────────── */
// .edu-row{
//   display:flex;
//   justify-content:space-between;
//   align-items:flex-start;
//   margin-bottom:7px;
//   gap:8px;
// }
// .edu-deg{
//   font-size:11px;
//   font-weight:700;
//   color:#0f172a;
// }
// .edu-sch{font-size:10px;color:#6b7280;margin-top:1px}
// .edu-yr{
//   font-size:9.5px;
//   color:#6b7280;
//   white-space:nowrap;
//   background:#eff6ff;
//   border:1px solid #bfdbfe;
//   border-radius:4px;
//   padding:1px 6px;
//   flex-shrink:0;
// }
 
// /* ─── ADDITIONAL ─────────────────────────────────────── */
// .add-txt{font-size:10.3px;color:#374151;line-height:1.65}
 
// </style>
// </head>
// <body>
 
// <!-- HEADER -->
// <div class="hdr">
//   <div class="nm">${resumeData.name || ''}</div>
//   <div class="rt">${roleTitle}</div>
//   <div class="ct">${contactParts}</div>
// </div>
 
// <!-- SUMMARY -->
// <div class="sec">
//   <div class="sec-hd"><span class="sec-line"></span><span class="sec-title">Professional Summary</span><span class="sec-line"></span></div>
//   <div class="sum">${resumeData.summary || ''}</div>
// </div>
 
// <!-- SKILLS -->
// <div class="sec">
//   <div class="sec-hd"><span class="sec-line"></span><span class="sec-title">Skills &amp; Core Competencies</span><span class="sec-line"></span></div>
//   ${skillsHTML}
// </div>
 
// ${certHTML}
// ${expHTML}
// ${projHTML}
// ${eduHTML}
// ${addHTML}
 
// </body>
// </html>`;
 
//         // ── PDF via Puppeteer ────────────────────────────────────
//         const browser = await puppeteer.launch({
//             headless: "new",
//             executablePath: process.env.CHROME_PATH ||
//                 (process.platform === "win32"
//                     ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
//                     : process.platform === "darwin"
//                     ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
//                     : "/usr/bin/google-chrome"),
//             args: ["--no-sandbox", "--disable-setuid-sandbox"]
//         });
 
//         const page = await browser.newPage();
//         await page.setContent(html, { waitUntil: "networkidle0" });
 
//         const pdfBuffer = await page.pdf({
//             format: "A4",
//             margin: { top: "14mm", bottom: "14mm", left: "15mm", right: "15mm" },
//             printBackground: true
//         });
 
//         await browser.close();
 
//         res.set({
//             "Content-Type": "application/pdf",
//             "Content-Disposition": `attachment; filename="resume_${Date.now()}.pdf"`
//         });
//         res.send(pdfBuffer);
 
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// }












async function generateResumePdfController(req, res) {
    try {
        const puppeteer = require("puppeteer-core");
 
        const report = await interviewReportModel.findOne({
            _id: req.params.reportId,
            user: req.user.id
        });
        if (!report) return res.status(404).json({ success: false, message: "Report not found" });
 
        const resumeData = await generateResumeContent({
            resume: report.resume,
            jobDescription: report.jobDescription,
            selfDescription: report.selfDescription
        });
 
        const safe = u => (!u ? '' : u.startsWith('http') ? u : `https://${u}`);
        const links = report.links || {};
 
        // ── CONTACT ROW ─────────────────────────────────────────
        const contactItems = [
            resumeData.location ? resumeData.location : null,
            resumeData.phone    ? resumeData.phone    : null,
            resumeData.email    ? `<a href="mailto:${resumeData.email}">${resumeData.email}</a>` : null,
            links.linkedin  ? `<a href="${safe(links.linkedin)}">linkedin.com/in/${links.linkedin.replace(/.*linkedin\.com\/in\//,'').replace(/\/?$/,'')}</a>` : null,
            links.github    ? `<a href="${safe(links.github)}">github.com/${links.github.replace(/.*github\.com\//,'').replace(/\/?$/,'')}</a>` : null,
            links.leetcode  ? `<a href="${safe(links.leetcode)}">LeetCode</a>` : null,
            links.gfg       ? `<a href="${safe(links.gfg)}">GeeksforGeeks</a>` : null,
            links.portfolio ? `<a href="${safe(links.portfolio)}">Portfolio</a>` : null,
            ...((links.extraLinks || []).map(l => l.url ? `<a href="${safe(l.url)}">${l.label || l.url}</a>` : null)),
        ].filter(Boolean);
        const contactHTML = contactItems.join(' <span class="dot">&#8226;</span> ');
 
        // ── SKILLS TABLE ─────────────────────────────────────────
        const skillsHTML = (resumeData.skillCategories || []).length
            ? `<table class="sk"><tbody>${resumeData.skillCategories.map(c =>
                `<tr><td class="sk-c"><b>${c.category}:</b></td><td class="sk-v">${c.skills}</td></tr>`
              ).join('')}</tbody></table>`
            : `<p class="sk-f">${(resumeData.skills || []).join(', ')}</p>`;
 
        // ── SECTION BUILDER ──────────────────────────────────────
        const sectionHead = title => `<div class="sh"><span>${title.toUpperCase()}</span></div>`;
 
        // ── CERTIFICATIONS ───────────────────────────────────────
        const certHTML = (resumeData.certifications || []).length ? `
<div class="sec">
  ${sectionHead('Certifications')}
  ${resumeData.certifications.map(c => `
  <div class="entry">
    <div class="entry-head">
      <span class="entry-title">${c.name}</span>
      <span class="entry-date">${c.date || ''}</span>
    </div>
    ${c.issuer ? `<div class="entry-sub">Issued by ${c.issuer}${c.link ? ` &nbsp;&#8212;&nbsp; <a href="${safe(c.link)}">View Certificate</a>` : ''}</div>` : ''}
  </div>`).join('')}
</div>` : '';
 
        // ── EXPERIENCE ───────────────────────────────────────────
        const expHTML = (resumeData.experience || []).length ? `
<div class="sec">
  ${sectionHead('Experience')}
  ${resumeData.experience.map(e => `
  <div class="entry">
    <div class="entry-head">
      <span class="entry-title">${e.role} &#8212; <span class="entry-co">${e.company}</span></span>
      <span class="entry-date">${e.duration}</span>
    </div>
    ${e.stack ? `<div class="entry-sub">${e.stack}</div>` : ''}
    <ul>${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul>
  </div>`).join('')}
</div>` : '';
 
        // ── PROJECTS ─────────────────────────────────────────────
        const projHTML = (resumeData.projects || []).length ? `
<div class="sec">
  ${sectionHead('Projects')}
  ${resumeData.projects.map(p => `
  <div class="entry">
    <div class="entry-head">
      <span class="entry-title">${p.name}${p.link ? ` <span class="entry-link">| <a href="${safe(p.link)}">${p.link.replace(/^https?:\/\//,'')}</a></span>` : ''}</span>
      ${p.date ? `<span class="entry-date">${p.date}</span>` : ''}
    </div>
    ${p.stack ? `<div class="entry-sub">${p.stack}</div>` : ''}
    <ul>${(p.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul>
  </div>`).join('')}
</div>` : '';
 
        // ── EDUCATION ────────────────────────────────────────────
        const eduHTML = (resumeData.education || []).length ? `
<div class="sec">
  ${sectionHead('Education')}
  ${resumeData.education.map(e => `
  <div class="entry">
    <div class="entry-head">
      <span class="entry-title">${e.degree}</span>
      <span class="entry-date">${e.year}</span>
    </div>
    <div class="entry-sub">${e.school}${e.grade && e.grade !== 'N/A' ? ' &nbsp;&#8212;&nbsp; ' + e.grade : ''}</div>
  </div>`).join('')}
</div>` : '';
 
        // ── ADDITIONAL ───────────────────────────────────────────
        const addHTML = resumeData.additional ? `
<div class="sec">
  ${sectionHead('Additional Information')}
  <p class="add">${resumeData.additional}</p>
</div>` : '';
 
        const roleTitle = (resumeData.roleTitle || 'Backend & Full Stack Developer');
 
        // ════════════════════════════════════════════════════════
        //  JAKE'S RESUME — Industry standard FAANG template
        //  Clean · ATS-friendly · Used by thousands at Google,
        //  Meta, Amazon, Microsoft, Apple
        //  Color: #1a1a2e (near-black navy) + subtle accent line
        // ════════════════════════════════════════════════════════
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
 
/* ═══ RESET ══════════════════════════════════════════════ */
*{margin:0;padding:0;box-sizing:border-box}
 
/* ═══ PAGE ═══════════════════════════════════════════════ */
html,body{
  width:100%;
  background:#fff;
}
body{
  font-family:'Times New Roman',Times,Georgia,serif;
  font-size:10.5pt;
  color:#1a1a2e;
  line-height:1.45;
}
 
/* Times New Roman is the ACTUAL font used in Jake's Resume
   and most top-tier FAANG resumes — it's ATS-perfect */
 
a{color:#1a1a2e;text-decoration:none}
b{font-weight:700}
 
/* ═══ HEADER ══════════════════════════════════════════════ */
.hdr{
  text-align:center;
  margin-bottom:6pt;
  padding-bottom:6pt;
}
.name{
  font-size:22pt;
  font-weight:700;
  letter-spacing:1.5pt;
  color:#1a1a2e;
  line-height:1.2;
  margin-bottom:2pt;
}
.role{
  font-size:10pt;
  font-weight:400;
  color:#444;
  letter-spacing:0.5pt;
  margin-bottom:5pt;
  font-style:italic;
}
.contact{
  font-size:9.5pt;
  color:#1a1a2e;
  line-height:1.8;
}
.contact a{color:#1a1a2e}
.dot{color:#777;margin:0 2pt}
 
/* ═══ SECTION ══════════════════════════════════════════════ */
.sec{margin-bottom:8pt}
 
/* Jake's Resume signature: full-width rule under section name */
.sh{
  border-bottom:1pt solid #1a1a2e;
  margin-bottom:5pt;
  padding-bottom:1pt;
}
.sh span{
  font-size:10.5pt;
  font-weight:700;
  letter-spacing:0.8pt;
  color:#1a1a2e;
  text-transform:uppercase;
}
 
/* ═══ SUMMARY ══════════════════════════════════════════════ */
.sum{
  font-size:10.5pt;
  color:#1a1a2e;
  line-height:1.55;
  text-align:justify;
}
 
/* ═══ SKILLS ════════════════════════════════════════════════ */
.sk{width:100%;border-collapse:collapse}
.sk tr{vertical-align:top}
.sk td{padding:1.2pt 0;font-size:10.5pt;line-height:1.45}
.sk-c{width:142pt;font-weight:700;color:#1a1a2e;padding-right:6pt;white-space:nowrap}
.sk-v{color:#222}
.sk-f{font-size:10.5pt;color:#222;line-height:1.6}
 
/* ═══ ENTRIES ═══════════════════════════════════════════════ */
.entry{margin-bottom:7pt}
 
.entry-head{
  display:flex;
  justify-content:space-between;
  align-items:baseline;
  gap:4pt;
}
.entry-title{
  font-size:10.5pt;
  font-weight:700;
  color:#1a1a2e;
  flex:1;
  line-height:1.4;
}
.entry-co{
  font-weight:400;
  font-style:italic;
}
.entry-date{
  font-size:10pt;
  color:#1a1a2e;
  white-space:nowrap;
  flex-shrink:0;
  font-style:italic;
}
.entry-sub{
  font-size:10pt;
  color:#444;
  font-style:italic;
  margin-top:1pt;
  margin-bottom:2pt;
}
.entry-link{
  font-weight:400;
  font-size:10pt;
}
.entry-link a{color:#1a1a2e;text-decoration:underline}
 
/* ═══ BULLETS ══════════════════════════════════════════════ */
ul{
  list-style:disc;
  padding-left:14pt;
  margin-top:2pt;
}
ul li{
  font-size:10.5pt;
  color:#1a1a2e;
  line-height:1.5;
  margin-bottom:1.5pt;
}
 
/* ═══ EDUCATION ════════════════════════════════════════════ */
/* re-uses .entry */
 
/* ═══ ADDITIONAL ═══════════════════════════════════════════ */
.add{font-size:10.5pt;color:#222;line-height:1.55}
 
</style>
</head>
<body>
 
<div class="hdr">
  <div class="name">${resumeData.name || 'MD AMAN'}</div>
  <div class="role">${roleTitle}</div>
  <div class="contact">${contactHTML}</div>
</div>
 
<div class="sec">
  ${sectionHead('Professional Summary')}
  <p class="sum">${resumeData.summary || ''}</p>
</div>
 
<div class="sec">
  ${sectionHead('Skills & Core Competencies')}
  ${skillsHTML}
</div>
 
${certHTML}
${expHTML}
${projHTML}
${eduHTML}
${addHTML}
 
</body>
</html>`;
 
        // ── PDF via Puppeteer ────────────────────────────────────
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
            margin: { top: "12mm", bottom: "12mm", left: "14mm", right: "14mm" },
            printBackground: false
        });
 
        await browser.close();
 
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="resume.pdf"`
        });
        res.send(pdfBuffer);
 
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}






module.exports = {
    generateReportController,
    getAllReportsController,
    getReportByIdController,
    deleteReportController,
    generateResumePdfController
};