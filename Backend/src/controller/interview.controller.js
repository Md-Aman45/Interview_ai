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

        let parsedExtraLinks = [];
                try { parsedExtraLinks = extraLinks ? JSON.parse(extraLinks) : []; } catch { parsedExtraLinks = []; }

        const report = await interviewReportModel.create({
            user: req.user.id,
            resume,
            selfDescription,
            jobDescription,
            links: { linkedin, github, portfolio, leetcode, gfg, extraLinks: parsedExtraLinks },
            // links: { linkedin, github, portfolio, leetcode, gfg, extraLinks: extraLinks || [] },
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
            .select("title matchScore scoreBreakdown hiringRecommendation averageScore createdAt");

        
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
        console.log("🔄 Resume PDF requested for report:", req.params.reportId);
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

        // ── CONTACT ROW ──────────────────────────────────────────
        const contactItems = [
            resumeData.location || null,
            resumeData.phone    || null,
            resumeData.email    ? `<a href="mailto:${resumeData.email}">${resumeData.email}</a>` : null,
            links.linkedin  ? `<a href="${safe(links.linkedin)}">LinkedIn</a>`       : null,
            links.github    ? `<a href="${safe(links.github)}">GitHub</a>`           : null,
            links.leetcode  ? `<a href="${safe(links.leetcode)}">LeetCode</a>`       : null,
            links.gfg       ? `<a href="${safe(links.gfg)}">GeeksforGeeks</a>`      : null,
            links.portfolio ? `<a href="${safe(links.portfolio)}">Portfolio</a>`     : null,
            ...((links.extraLinks || []).map(l => l.url ? `<a href="${safe(l.url)}">${l.label || l.url}</a>` : null)),
        ].filter(Boolean);
        const contactHTML = contactItems.join('<span class="pipe"> | </span>');

        // ── SKILLS ───────────────────────────────────────────────
        const skillsHTML = (resumeData.skillCategories || []).length
            ? `<table class="sk"><tbody>${resumeData.skillCategories.map(c =>
                `<tr><td class="sk-c"><b>${c.category}</b></td><td class="sk-v">${c.skills}</td></tr>`
              ).join('')}</tbody></table>`
            : `<p class="sk-f">${(resumeData.skills || []).join('  •  ')}</p>`;

        // ── SECTION HEADING ──────────────────────────────────────
        const S = t => `<div class="sec-title">${t}</div>`;

        // ── CERTIFICATIONS ───────────────────────────────────────
        const certHTML = (resumeData.certifications || []).length ? `
<div class="sec">${S('Certifications')}
${resumeData.certifications.map(c => `
<div class="entry">
  <div class="entry-head">
    <span class="entry-title">${c.name}</span>
    <span class="entry-date">${c.date || ''}</span>
  </div>
  ${c.issuer ? `<div class="entry-sub">Issued by ${c.issuer}${c.link ? ` &nbsp;|&nbsp; <a href="${safe(c.link)}">View Certificate</a>` : ''}</div>` : ''}
</div>`).join('')}
</div>` : '';

        // ── EXPERIENCE ───────────────────────────────────────────
        const expHTML = (resumeData.experience || []).length ? `
<div class="sec">${S('Experience')}
${resumeData.experience.map(e => `
<div class="entry">
  <div class="entry-head">
    <span class="entry-title">${e.role} — ${e.company}</span>
    <span class="entry-date">${e.duration}</span>
  </div>
  ${e.stack ? `<div class="entry-stack">Stack: ${e.stack}</div>` : ''}
  <ul>${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul>
</div>`).join('')}
</div>` : '';

        // ── PROJECTS ─────────────────────────────────────────────
        const projHTML = (resumeData.projects || []).length ? `
<div class="sec">${S('Projects')}
${resumeData.projects.map(p => `
<div class="entry">
  <div class="entry-head">
    <span class="entry-title">${p.name}${p.link ? ` <span class="entry-link">| <a href="${safe(p.link)}">${p.link.replace(/^https?:\/\//,'')}</a></span>` : ''}</span>
    ${p.date ? `<span class="entry-date">${p.date}</span>` : ''}
  </div>
  ${p.stack ? `<div class="entry-stack">${p.stack}</div>` : ''}
  <ul>${(p.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul>
</div>`).join('')}
</div>` : '';

        // ── EDUCATION ────────────────────────────────────────────
        const eduHTML = (resumeData.education || []).length ? `
<div class="sec">${S('Education')}
${resumeData.education.map(e => `
<div class="edu-row">
  <div class="edu-l">
    <div class="edu-deg">${e.degree}</div>
    <div class="edu-sch">${e.school}${e.grade && e.grade !== 'N/A' ? ' &nbsp;|&nbsp; ' + e.grade : ''}</div>
  </div>
  <div class="edu-yr">${e.year}</div>
</div>`).join('')}
</div>` : '';

        // ── ADDITIONAL ───────────────────────────────────────────
        const addHTML = resumeData.additional ? `
<div class="sec">${S('Additional Information')}
<p class="add">${resumeData.additional}</p>
</div>` : '';

        // ── FINAL HTML ───────────────────────────────────────────
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;background:#fff}
body{
  font-family:Arial,Helvetica,sans-serif;
  font-size:9.5pt;
  color:#1a1a1a;
  line-height:1.4;
}
a{color:#1a1a1a;text-decoration:none}

/* HEADER */
.hdr{margin-bottom:7pt;padding-bottom:6pt;border-bottom:1.5pt solid #1a1a1a;text-align:center}
.name{font-size:19pt;font-weight:700;color:#1a1a1a;letter-spacing:0.3pt;margin-bottom:2pt}
.role{font-size:9.8pt;color:#444;margin-bottom:4pt;font-weight:400}
.contact{font-size:8.8pt;color:#222;line-height:1.8}
.contact a{color:#1a1a1a}
.pipe{color:#999}

/* SECTION */
.sec{margin-bottom:8pt}
.sec-title{
  font-size:9pt;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:0.8pt;
  color:#1a1a1a;
  border-bottom:1pt solid #1a1a1a;
  padding-bottom:2pt;
  margin-bottom:5pt;
}

/* SUMMARY */
.sum{font-size:9.5pt;line-height:1.55;color:#222}

/* SKILLS */
.sk{width:100%;border-collapse:collapse}
.sk td{padding:1.5pt 0;font-size:9.5pt;line-height:1.4;vertical-align:top}
// .sk-c{width:112pt;font-weight:700;color:#1a1a1a;padding-right:8pt;white-space:nowrap}
.sk-c{width:125pt;font-weight:700;color:#1a1a1a;padding-right:10pt;white-space:nowrap}
.sk-v{color:#1a1a1a}
.sk-f{font-size:9.5pt;color:#222;line-height:1.55}

/* ENTRIES */
.entry{margin-bottom:7pt}
.entry-head{display:flex;justify-content:space-between;align-items:baseline;gap:4pt;margin-bottom:1.5pt}
.entry-title{font-size:9.8pt;font-weight:700;color:#1a1a1a;flex:1;line-height:1.3}
.entry-date{font-size:9pt;color:#444;white-space:nowrap;flex-shrink:0}
.entry-sub{font-size:9pt;color:#444;font-style:italic;margin-bottom:2.5pt}
.entry-stack{font-size:9pt;color:#444;margin-bottom:2.5pt}
.entry-link{font-weight:400;font-size:9pt}
.entry-link a{color:#1a1a1a;text-decoration:underline}

/* BULLETS */
ul{list-style:none;padding:0;margin:2pt 0 0 0}
ul li{
  font-size:9.5pt;
  color:#1a1a1a;
  line-height:1.45;
  margin-bottom:2pt;
  padding-left:10pt;
  position:relative;
}
ul li::before{content:"•";position:absolute;left:1pt;top:0;color:#555;font-size:9pt}

/* EDUCATION */
.edu-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:5pt;gap:6pt}
.edu-deg{font-weight:700;font-size:9.8pt;color:#1a1a1a}
.edu-sch{font-size:9pt;color:#444;margin-top:1.5pt}
.edu-yr{font-size:9pt;color:#444;white-space:nowrap;flex-shrink:0;text-align:right}

/* ADDITIONAL */
.add{font-size:9.5pt;color:#333;line-height:1.55}
</style>
</head>
<body>

<div class="hdr">
  <div class="name">${resumeData.name || 'Candidate'}</div>
  <div class="role">${resumeData.roleTitle || 'Backend & Full Stack Developer'}</div>
  <div class="contact">${contactHTML}</div>
</div>

<div class="sec">
  <div class="sec-title">Summary</div>
  <p class="sum">${resumeData.summary || ''}</p>
</div>

<div class="sec">
  <div class="sec-title">Skills</div>
  ${skillsHTML}
</div>

${certHTML}
${expHTML}
${projHTML}
${eduHTML}
${addHTML}

</body>
</html>`;

        // ── PUPPETEER ────────────────────────────────────────────
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