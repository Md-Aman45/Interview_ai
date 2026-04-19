const getResume = () => {
    return `
Name: Azim Ahmad
Email: amiz123@gmail.com
Phone: +91-9876543210
Location: Bihar, India

EDUCATION:
Bachelor of Computer Applications (BCA)
XYZ University | 2022–2025 | CGPA: 8.5/10

TECHNICAL SKILLS:
Languages: JavaScript (ES6+)
Backend: Node.js, Express.js
Database: MongoDB, MySQL
Frontend: React.js (Basic)
Tools: Git, GitHub

CORE CONCEPTS:
Data Structures & Algorithms, OOP, DBMS, Operating Systems

PROJECTS:
1. Video Calling Web Application
   Tech: WebRTC, Socket.io, Node.js
   - Real-time communication with multiple users
   - Multi-user room system with authentication

2. Interview AI Platform
   Tech: Node.js, MongoDB, Gemini API
   - Full-stack AI interview system
   - Auto evaluation of answers
   - Login/signup authentication

3. Task Manager API
   Tech: Node.js, Express.js, MongoDB
   - REST API with full CRUD operations
   - JWT-based authentication

ACHIEVEMENTS:
- Solved 300+ DSA problems on LeetCode and GFG
- Participated in coding contests

STRENGTHS: Problem solving, fast learner, team collaboration
WEAKNESS: Sometimes overthinks solutions
`;
};


const getSelfDescription = () => {
    return `
I am a passionate backend developer with strong interest in building scalable systems and real-world applications.

I have solid experience with JavaScript, Node.js, Express.js, and MongoDB. I enjoy building REST APIs and working with databases.

I have built advanced projects like a Video Calling App using WebRTC and Socket.io, and an Interview AI Platform using Gemini API.

I continuously practice Data Structures and Algorithms with 300+ problems solved. I am a quick learner, team player, and always eager to grow.

I am looking for a Software Developer Intern position where I can apply my backend skills, learn from experienced developers, and contribute to real products.
`;
};


const getJobDescription = () => {
    return `
Job Role: Software Developer Intern
Company: Tech Solutions Pvt. Ltd.
Company Type: Startup

RESPONSIBILITIES:
- Build and maintain backend services using Node.js and Express
- Design and consume RESTful APIs
- Work with databases like MongoDB or MySQL
- Collaborate with frontend developers
- Debug and optimize application performance
- Write clean, maintainable code

REQUIREMENTS:
- Strong JavaScript fundamentals
- Good knowledge of Node.js and Express.js
- Database experience with MongoDB or MySQL
- REST API design knowledge
- Git and version control
- Good problem solving skills

PREFERRED SKILLS:
- Basic React.js knowledge
- JWT authentication experience
- Deployment knowledge (Render, Vercel)

SOFT SKILLS:
- Good communication
- Team player
- Willingness to learn
`;
};


module.exports = { getResume, getSelfDescription, getJobDescription };