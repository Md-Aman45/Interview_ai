# InterviewAI — AI-Powered Interview Preparation Platform

> A full-stack GenAI application that helps job seekers prepare for technical interviews through resume analysis, AI-generated reports, and real-time voice mock interviews.

---

## What It Does

Upload your resume and a job description → get an AI-powered analysis with match score, skill gaps, and interview questions → practice with a voice mock interview that scores you live → track your improvement over time.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:8080/api` |

---

## Repository Structure

```
GenAI/
├── README.md                        ← You are here
├── Backend/                         ← Node.js + Express API
│   ├── README.md
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── controller/
│       ├── services/
│       ├── models/
│       ├── routes/
│       └── middlewares/
└── Frontend_Interview_AI/           ← React + Vite SPA
    ├── README.md
    ├── vite.config.js
    ├── package.json
    └── src/
        └── app/
            ├── pages/
            ├── components/
            ├── services/
            ├── context/
            └── utils/
```

---

## Full Tech Stack

### Backend
| Category | Technology |
|----------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| AI (Reports) | Google Gemini API |
| AI (Mock) | Groq API — llama-3.3-70b |
| Auth | JWT + HTTP-only cookies |
| Email | Nodemailer (OTP + reset) |
| PDF Parsing | pdf-parse + Multer |
| PDF Generation | Puppeteer-core |
| Validation | Zod |

### Frontend
| Category | Technology |
|----------|-----------|
| Framework | React 19 + Vite |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 |
| UI | shadcn/ui + Radix UI |
| Charts | Recharts |
| Voice | Web Speech API (SpeechRecognition + SpeechSynthesis) |
| HTTP | Axios |
| Animations | Framer Motion |

---

## Core Features

### 1. Resume Analysis & Report Generation
- Upload PDF resume + paste job description + specify role
- Google Gemini AI analyzes the match using strict JSON schema (Zod)
- Returns: match score (0–100), skill gaps with severity, 5 technical questions, 3 behavioral questions, 5-day prep plan, hiring recommendation

### 2. Voice Mock Interview
- Pick a report → start a 30-minute live session
- AI speaks questions via `SpeechSynthesis` API
- User answers via microphone (`SpeechRecognition`)
- Groq evaluates each answer in < 1 second → score/10 + feedback
- 8-second silence detection with visual countdown → auto-submit
- Session integrity: back-button guard, tab-switch detection (3 warnings), consecutive 1/10 pause prompt

### 3. Tailored Resume Generation
- AI rewrites your resume tailored to the job description
- Professional FAANG-style PDF via Puppeteer (Times New Roman, ATS-friendly)
- Includes: summary, skills table, experience bullets, projects, education

### 4. Analytics Dashboard
- Score trend chart (Recharts AreaChart)
- Weak topic identification from mock sessions
- Monthly usage tracking (reports / resume exports / mock sessions)
- Editable profile links (GitHub, LinkedIn, custom)

### 5. Auth & Security
- Email OTP verification on registration
- JWT in HTTP-only cookies (XSS-safe)
- Token blacklist on logout
- Forgot password via email reset link
- Monthly usage limits enforced server-side

---

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Google Chrome (for Puppeteer PDF generation)
- Google Gemini API key
- Groq API key
- Gmail account with App Password (for Nodemailer)

### 1. Clone & Install

```bash
git clone https://github.com/Md-Aman45/Interview_ai
cd GenAI

# Backend
cd Backend && npm install

# Frontend
cd ../Frontend_Interview_AI && npm install
```

### 2. Environment Setup

**Backend** — create `Backend/.env`:
```env
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```

**Frontend** — create `Frontend_Interview_AI/.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Run

```bash
# Terminal 1 — Backend
cd Backend && npm run dev

# Terminal 2 — Frontend
cd Frontend_Interview_AI && npm run dev
```

Open `http://localhost:5173` in Google Chrome.

> **Note:** Use Google Chrome for Voice Mock Interview — `SpeechRecognition` API requires Chrome.

---

## API Overview

| Base | Description |
|------|-------------|
| `/api/auth` | Register, login, OTP, password reset |
| `/api/interview` | Report generation, report CRUD, resume PDF |
| `/api/mock` | Mock session start, answer submit, session end |
| `/api/analytics` | Performance summary, usage stats |

Full API documentation → [Backend README](./Backend/README.md)

---

## Usage Limits (Per User / Month)

| Resource | Limit |
|----------|-------|
| Report generations | 20 |
| Resume PDF exports | 15 |
| Mock interview sessions | 10 |

Limits reset on the 1st of each month. Displayed live in the dashboard.

---

## Developer

**MD Aman** — Backend & Full Stack Developer  
BCA, Patna College, Patna University | SGPA: 8.89/10 | Expected May 2026

- GitHub: [github.com/Md-Aman45](https://github.com/Md-Aman45)
- LinkedIn: [linkedin.com/in/md-aman](https://www.linkedin.com/in/md-aman-7941a0355/)
- Email: aman9534577@gmail.com

---

## License

MIT