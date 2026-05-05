# InterviewAI — Backend API

> Node.js + Express REST API powering the InterviewAI platform — resume analysis, AI mock interviews, and performance analytics.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express 5 |
| Database | MongoDB (Mongoose 9) |
| AI — Report | Google Gemini API (`@google/genai`) |
| AI — Mock | Groq SDK (`llama-3.3-70b`) |
| Auth | JWT + HTTP-only cookies |
| File parsing | Multer + pdf-parse |
| PDF generation | Puppeteer-core |
| Email | Nodemailer |
| Validation | Zod + zod-to-json-schema |

---

## Project Structure

```
Backend/
├── server.js                  # Entry point
└── src/
    ├── app.js                 # Express app setup, CORS, middleware
    ├── config/
    │   └── database.js        # MongoDB connection
    ├── controller/
    │   ├── auth.controller.js        # Register, login, OTP, password reset
    │   ├── interview.controller.js   # Report generation, resume PDF
    │   ├── mock.controller.js        # Mock session lifecycle
    │   ├── analytics.controller.js   # Usage stats and score history
    │   └── health.controller.js      # Health check endpoint
    ├── middlewares/
    │   ├── auth.middleware.js        # JWT verification
    │   ├── file.middleware.js        # Multer + PDF text extraction
    │   └── limit.middleware.js       # Monthly usage rate limiting
    ├── models/
    │   ├── User.js                   # User schema (email, OTP, isVerified)
    │   ├── interviewReport.model.js  # Report + scores + questions
    │   ├── mockSession.model.js      # Mock session + answers + scores
    │   ├── usageLimit.model.js       # Per-user monthly counters
    │   └── blacklist.model.js        # JWT token blacklist (logout)
    ├── routes/
    │   ├── auth.routes.js
    │   ├── interview.routes.js
    │   ├── mock.routes.js
    │   ├── analytics.routes.js
    │   └── health.routes.js
    └── services/
        ├── ai.service.js      # Gemini report generation + resume content
        ├── groq.service.js    # Groq answer evaluation
        └── email.service.js   # OTP + password reset emails
```

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Register new user, sends OTP email |
| POST | `/verify-otp` | Public | Verify email OTP |
| POST | `/login` | Public | Login, sets JWT cookie |
| GET | `/logout` | Public | Clears cookie, blacklists token |
| GET | `/get-me` | 🔒 Private | Get current user details |
| POST | `/forgot-password` | Public | Send password reset email |
| POST | `/reset-password` | Public | Reset password with token |
| POST | `/change-password` | 🔒 Private | Change password (authenticated) |

### Interview — `/api/interview`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/generate` | 🔒 Private | Upload resume PDF + JD → AI report |
| GET | `/reports` | 🔒 Private | Get all reports for user |
| GET | `/reports/:id` | 🔒 Private | Get single report detail |
| DELETE | `/reports/:id` | 🔒 Private | Delete a report |
| POST | `/resume/:reportId` | 🔒 Private | Generate tailored PDF resume |

### Mock Interview — `/api/mock`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/start` | 🔒 Private | Start session from report |
| POST | `/answer` | 🔒 Private | Submit voice answer, get score |
| POST | `/end` | 🔒 Private | End session, get summary |
| GET | `/sessions` | 🔒 Private | Get all past sessions |

### Analytics — `/api/analytics`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/summary` | 🔒 Private | Avg score, weak topics, session count |
| GET | `/usage` | 🔒 Private | Monthly usage counters + limits |

---

## Environment Variables

Create a `.env` file in `Backend/`:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/interviewai
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
COOKIE_MAX_AGE=604800000

# Google Gemini
GEMINI_API_KEY=your_gemini_key

# Groq
GROQ_API_KEY=your_groq_key

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Chrome path for Puppeteer PDF generation
CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe

FRONTEND_URL=http://localhost:5173
```

---

## Getting Started

```bash
# 1. Install dependencies
cd Backend
npm install

# 2. Set up .env (see above)

# 3. Start development server
npm run dev
# → Server running on http://localhost:8080
```

---

## Key Features

### AI Report Generation
Gemini AI analyzes the resume PDF against the job description using strict JSON schema validation via Zod. Returns:
- Match score (0–100) across 4 dimensions
- Skill gap analysis with severity levels
- 5 role-specific technical questions with ideal answers
- 3 behavioral questions
- 5-day preparation plan
- Hiring recommendation with confidence score

### Voice Mock Interview
Groq (llama-3.3-70b) evaluates spoken answers in under 1 second. Each answer gets:
- Score out of 10
- Detailed feedback paragraph
- Ideal answer hint for the next question
- 30-minute session timer with auto-end

### Usage Limits (Per User/Month)
- 20 report generations
- 15 resume PDF exports
- 10 mock interview sessions

Enforced via `limit.middleware.js` + `UsageLimits` MongoDB collection with monthly auto-reset.

### Security
- JWT stored in HTTP-only cookies (not localStorage)
- Token blacklist on logout (MongoDB TTL index)
- bcrypt password hashing (10 rounds)
- Email OTP verification before first login
- CORS restricted to client origin

---

## Database Models

### User
```
username, email, password (bcrypt), isVerified, otp, otpExpires, createdAt
```

### InterviewReport
```
user (ref), jobRole, jobDescription, resume (raw text), matchScore {overall, technical, projects, problemSolving, communication}, skillGaps[], technicalQuestions[], behavioralQuestions[], preparationPlan[], hiringRecommendation, overallAnalysis, links
```

### MockSession
```
user (ref), report (ref), sessionId, startedAt, timeLimit, answers[], status, summary {totalQuestions, averageScore}
```

### UsageLimits
```
user (ref), month, reports {used, limit}, resumes {used, limit}, mockInterviews {used, limit}, resetDate
```