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

        const text = pdfData.text.trim();
        
        if (!text || text.length < 50) {
            return res.status(400).json({
                success: false,
                message: "Could not extract text from PDF. Please make sure your PDF contains selectable text, not a scanned image."
            });
        }

        req.resumeText = pdfData.text;
        next();

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Could not read PDF file. Make sure it is a valid text-based PDF."
        });
    }
}




module.exports = { upload, extractResumeText };