require('dotenv').config();
const app = require('./src/app');
const connectToDB = require('./src/config/database');

connectToDB();


app.listen(8080, () => {
    console.log(`Server is running on 8080`);
})