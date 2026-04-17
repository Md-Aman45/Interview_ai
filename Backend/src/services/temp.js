/**
 * @name Temp Data Functions
 * @description Detailed data for resume, selfDescription, jobDescription
 */

// 📄 Resume
const getResume = () => {
    return `
    Name: Azim Ahmad
    Email: amiz123@gmail.com
    Phone: +91-9876543210
    Location: Bihar, India

    Education:
    Bachelor of Computer Applications (BCA)
    XYZ University (2022 - 2025)
    CGPA: 8.5/10

    Technical Skills:
    - JavaScript (ES6+)
    - Node.js, Express.js
    - MongoDB, MySQL
    - React.js (Basic)
    - HTML, CSS, SCSS
    - REST API Development
    - Git & GitHub

    Core Concepts:
    - Data Structures & Algorithms
    - OOPs Concepts
    - DBMS
    - Operating Systems (Basics)

    Projects:
    1. Video Calling Web Application
       - Built using WebRTC, Socket.io, Node.js
       - Real-time communication with multiple users
       - Implemented authentication and room system

    2. Interview AI Platform
       - Full-stack application with login/signup system
       - Integrated Gemini AI for mock interview
       - Generates questions and evaluates answers

    3. Task Manager API
       - REST API using Express and MongoDB
       - CRUD operations with authentication
       - JWT-based authorization

    Achievements:
    - Solved 300+ problems on LeetCode/GFG
    - Participated in coding contests
    - Strong debugging and logical thinking skills

    Strengths:
    - Problem-solving mindset
    - Fast learner
    - Team collaboration

    Weakness:
    - Sometimes overthink solutions
    `;
};


// 🧠 Self Description
const getSelfDescription = () => {
    return `
    I am a highly motivated and passionate software developer with a strong interest in backend development.

    I enjoy solving challenging problems and building real-world applications that create impact.
    I have a solid understanding of JavaScript, Node.js, and database systems.

    I am comfortable working with APIs, authentication systems, and scalable backend architecture.

    I continuously practice Data Structures and Algorithms to improve my problem-solving ability.

    I am a quick learner and adapt easily to new technologies and environments.

    I enjoy working in a team and collaborating with others to build efficient solutions.

    I am currently looking for an internship opportunity where I can apply my skills, learn from experienced developers, and grow in the field of software engineering.

    My goal is to become a skilled backend developer and contribute to high-quality products.
    `;
};


// 💼 Job Description
const getJobDescription = () => {
    return `
    Job Role: Software Developer Intern

    Company: Tech Solutions Pvt. Ltd.

    Responsibilities:
    - Develop and maintain backend services using Node.js and Express
    - Design and consume RESTful APIs
    - Work with databases like MongoDB or MySQL
    - Collaborate with frontend developers and designers
    - Debug and optimize application performance
    - Write clean, maintainable, and scalable code

    Requirements:
    - Strong knowledge of JavaScript fundamentals
    - Good understanding of Node.js and Express.js
    - Familiarity with database systems (MongoDB/MySQL)
    - Knowledge of REST API design
    - Understanding of Git and version control
    - Good problem-solving and logical thinking skills

    Preferred Skills:
    - Basic knowledge of React.js
    - Experience with real-world projects
    - Understanding of authentication (JWT)
    - Knowledge of deployment (Render, Vercel, etc.)

    Soft Skills:
    - Good communication skills
    - Team player
    - Willingness to learn and grow
    `;
};


module.exports = {
    getResume,
    getSelfDescription,
    getJobDescription
};