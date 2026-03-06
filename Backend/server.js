require('dotenv').config();
const app = require('./src/app');
const connectToDB = require('./src/config/database');

// Database connection
connectToDB();

const PORT = process.env.PORT || 8080;


app.listen(8080, () => {
    console.log(`🚀 Server running on port ${PORT}`);


    console.log("🩺 Health Check");
    console.log("Server Status: OK");
});