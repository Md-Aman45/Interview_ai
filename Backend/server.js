require('dotenv').config();
const app = require('./src/app');
const connectToDB = require('./src/config/database');
const { getResume, getSelfDescription, getJobDescription } = require('./src/services/temp');
const generateInterviewReport = require('./src/services/ai.service');


// Database connection...
connectToDB();



// // Test Gemini AI...
// invokeGeminiAI("Hello gemini ! Explain what is Interview ?");
generateInterviewReport({ resume: getResume(), selfDescription: getSelfDescription(), jobDescription: getJobDescription() });



// Start the server...
const PORT = process.env.PORT || 8080;



// Server running and 100% health check... 
app.listen(8080, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("🩺 Health Check");
    console.log("Server Status: OK");
});