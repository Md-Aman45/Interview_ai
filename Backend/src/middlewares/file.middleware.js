const multer = require('multer');
const pdfParse = require('pdf-parse');

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf") {
            cb(null, true);
        }
        else {
            cb(new Error("Only PDF files are allowed"), false);
        }
    }
});



async function extractResumeText(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF is required"
            });
        }

        const pdfData = await pdfParse(req.file.buffer);
        req.resumeText = pdfData.text;
        next();

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Could not read PDF file"
        });
    }
}




module.exports = { upload, extractResumeText };