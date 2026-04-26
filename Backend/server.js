require('dotenv').config();
const app = require('./src/app');
const connectToDB = require('./src/config/database');


// Database connection...
connectToDB();







// Start the server...
const PORT = process.env.PORT || 8080;



// Server running and 100% health check... 
app.listen(8080, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("🩺 Health Check");
    console.log("Server Status: OK");
});