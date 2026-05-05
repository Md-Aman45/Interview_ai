# InterviewAI — Frontend

> React + Vite single-page application for the InterviewAI platform.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui + Radix UI |
| Charts | Recharts |
| Animations | Framer Motion |
| HTTP Client | Axios |
| Notifications | Sonner (toast) |
| Icons | Lucide React |
| Theme | CSS variables (light/dark) |

---

## Project Structure

```
Frontend_Interview_AI/
├── index.html
├── vite.config.js
└── src/
    ├── main.jsx                    # App entry point
    ├── styles/
    │   ├── index.css               # Global imports
    │   ├── theme.css               # CSS custom properties (light/dark)
    │   └── tailwind.css            # Tailwind directives
    └── app/
        ├── App.jsx                 # Router + providers
        ├── config/
        │   └── api.js              # Axios instance + interceptors
        ├── context/
        │   ├── AuthContext.jsx     # User auth state + login/logout/OTP
        │   └── ThemeContext.jsx    # Light/dark mode toggle
        ├── components/
        │   ├── Layout.jsx          # Sidebar + topbar shell
        │   ├── Badge.jsx           # Status badge variants
        │   ├── ScoreCircle.jsx     # Animated SVG score ring
        │   ├── ProgressBar.jsx     # Usage progress bars
        │   ├── LoadingSpinner.jsx  # Full-screen loader
        │   ├── EmptyState.jsx      # Empty list placeholder
        │   └── ProtectedRoute.jsx  # Auth guard wrapper
        ├── pages/
        │   ├── Landing.jsx         # Public landing page
        │   ├── Login.jsx           # Sign in + forgot password modal
        │   ├── Register.jsx        # Sign up + OTP verification
        │   ├── Dashboard.jsx       # Overview + stats + profile links
        │   ├── Reports.jsx         # Reports list with search
        │   ├── NewReport.jsx       # Create report (upload + JD + role)
        │   ├── ReportDetail.jsx    # Full report with tabs
        │   ├── MockInterview.jsx   # Voice mock interview (live session)
        │   ├── Analytics.jsx       # Score trends + weak topics
        │   └── Settings.jsx        # Profile + password + links
        ├── services/
        │   ├── auth.service.js     # Login, register, OTP, password APIs
        │   ├── interview.service.js # Reports + resume download
        │   ├── mock.service.js     # Session start/answer/end
        │   └── analytics.service.js # Summary + usage data
        └── utils/
            ├── formatters.js       # Date, score, badge formatters
            ├── normalizers.js      # API response normalizers
            └── validation.js      # Email, password, file validators
```

---

## Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Public homepage with features and CTA |
| Login | `/login` | Email + password with forgot password |
| Register | `/register` | Username/email/password + OTP verification |
| Dashboard | `/dashboard` | Stats, recent reports, usage, profile links |
| Reports | `/reports` | All reports with search and download |
| New Report | `/reports/new` | 3-step form: resume + role + JD |
| Report Detail | `/reports/:id` | Tabbed: overview, questions, gaps, prep plan |
| Mock Interview | `/mock` | Instructions → pick report → live voice session |
| Analytics | `/analytics` | Score trend chart + usage bars + weak topics |
| Settings | `/settings` | Change password + editable profile links |

---

## Environment Variables

Create a `.env` file in `Frontend_Interview_AI/`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Getting Started

```bash
# 1. Install dependencies
cd Frontend_Interview_AI
npm install

# 2. Set up .env (see above)

# 3. Start development server
npm run dev
# → App running on http://localhost:5173
```

---

## Key Features

### Authentication Flow
- Cookie-based JWT (no localStorage tokens)
- OTP email verification on registration
- Auto-login after OTP verification
- Forgot password → email reset link
- Auth interceptor fires `auth:expired` event on 401

### Mock Interview — Live Session
- Fullscreen takeover (no sidebar)
- `SpeechSynthesis` API for AI voice questions
- `SpeechRecognition` API for user voice input
- 8-second silence countdown bar → auto-submit
- Back button guard (popstate listener) → quit modal
- Tab-switch detection (visibilitychange) → 3 warnings then auto-end
- 3× consecutive 1/10 scores → pause modal
- Conversation history sidebar with color-coded feedback bubbles

### Report Detail — Tabbed Layout
- **Overview**: Score ring, summary, skill gaps preview, prep plan preview
- **Questions**: Collapsible technical + behavioral question cards
- **Skill Gaps**: Color-coded by severity (critical/moderate/minor)
- **Prep Plan**: 5-day color-coded plan cards

### Dashboard — Profile Links
- Editable profile links (GitHub, LinkedIn, Portfolio, LeetCode, GeeksforGeeks)
- User can add unlimited custom links with emoji icon + label
- Saved to `localStorage` per browser session

### Theme
- Light/dark mode via CSS variables + `ThemeContext`
- Toggle available on Landing, Login, Register (before auth)
- Persists across sessions via `localStorage`

### Draft Auto-Save (New Report)
- Job description auto-saved to `localStorage` every 600ms
- Last 3 job descriptions stored in history
- "Recent" dropdown to reload previous JD instantly

---

## Component Architecture

```
App (Router + AuthProvider + ThemeProvider)
└── ProtectedRoute
    └── Layout (sidebar + topbar)
        ├── Dashboard
        ├── Reports → ReportDetail
        ├── NewReport
        ├── MockInterview (bypasses Layout in live session)
        ├── Analytics
        └── Settings
```

---

## API Integration

All API calls go through the Axios instance in `src/app/config/api.js`:
- `baseURL` from `VITE_API_BASE_URL`
- `withCredentials: true` (sends cookies automatically)
- Response interceptor: fires `auth:expired` on 401 (except auth routes)
- Request interceptor: no manual token needed — cookies are automatic