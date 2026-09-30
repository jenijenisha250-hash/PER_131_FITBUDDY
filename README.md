# FitBuddy – AI Fitness Plan Generator

**“Your AI-powered personal fitness companion”**

## 1. Project Title
**FitBuddy – AI Fitness Plan Generator**

## 2. Project Description
FitBuddy is an AI-powered personal fitness and wellness web application built with **Google Gemini** (`@google/genai`). It generates structured, personalized 7-day workout schedules (Day 1 through Day 7), goal-aligned nutrition and recovery protocols, and supports iterative feedback-driven plan updates while preserving each athlete's original baseline plan. It also provides an **Admin / Coach Dashboard** to view, search, filter, inspect, and manage registered users and their workout histories.

## 3. Features
- **Personalized 7-Day Workout Plan Generation**: Evaluates Full Name, User ID, Age, Weight (kg), Fitness Goal, Workout Intensity, Experience Level, Available Workout Days (1–7), Preferred Workout Duration (20–90 minutes), and custom preferences.
- **Structured Daily Programming (Day 1 → Day 7)**: Every day includes Workout Focus, Warm-up (5–10 mins), Main Exercises (Sets × Reps/Duration, Rest time, and coaching cues), Cool-down, and Recovery guidance.
- **💡 AI Nutrition & Recovery Tip**: Generates a complementary nutrition, hydration, meal-timing, and sleep/recovery protocol tailored to the user's goal.
- **Feedback-Based Workout Plan Regeneration**: Users can submit natural-language feedback (e.g., *"Add more cardio, reduce workout intensity, include yoga"*) to generate an **Updated Plan** while preserving the **Original Plan** in **Plan History**.
- **Print & Download Support**: Export any 7-day fitness plan as a clean `.txt` file or print a formatted training sheet.
- **Admin / Coach Dashboard**: View total users, plans generated, updated plans, and active users; search by Name or User ID; filter by Goal, Intensity, and Experience; sort by Newest, Oldest, or Goal; inspect profiles, original plans, updated plans, and feedback logs; or delete records.

## 4. Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express (`server.ts` with modular `/app/` architecture)
- **AI Engine**: Google Gemini (`@google/genai` SDK, `gemini-3.8-flash` with structured JSON `responseSchema`)
- **Persistence**: File-backed relational JSON database (`data/fitbuddy_db.json`) mirroring the SQLite/SQLAlchemy user & plan history schema

## 5. Gemini Integration
All Gemini API calls are executed strictly on the server inside `/app/gemini_service.ts` using `@google/genai`:
- `generateWorkoutPlan(profile)`: Generates the 7-day structured workout plan and combines it with `generateNutritionTip(profile)`.
- `generateNutritionTip(profile)`: Generates goal-specific hydration, macro pillars, peri-workout meal timing, and recovery protocols.
- `updateWorkoutPlan(profile, existingPlan, feedback)`: Sends the user profile, existing 7-day plan, and user feedback to Gemini to produce an updated 7-day plan and change summary.

## 6. Setup Instructions
1. Clone or open the project in Google AI Studio.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `GEMINI_API_KEY` environment variable in the AI Studio Secrets panel or `.env` file.

## 7. Environment Variables
Create or configure the following variables (see `.env.example`):
- `GEMINI_API_KEY`: Required for server-side Google Gemini API requests.
- `APP_URL`: Application URL injected at runtime.

## 8. How to Run the Project
- **Development Mode** (Express + Vite middleware on port 3000):
  ```bash
  npm run dev
  ```
- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

## 9. API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check and dashboard statistics |
| `POST` | `/generate-workout` (`/api/generate-workout`) | Validates profile and generates a 7-day plan + nutrition tip via Gemini |
| `POST` | `/submit-feedback` (`/api/submit-feedback`) | Updates an existing user's 7-day plan using feedback while preserving the original plan |
| `GET` | `/users` (`/api/users`, `/view-all-users`) | Returns all registered users and dashboard statistics |
| `GET` | `/users/:user_id` (`/api/users/:user_id`) | Retrieves a specific user record and plan history |
| `DELETE` | `/users/:user_id` (`/api/users/:user_id`) | Deletes a user record from persistent storage |

## 10. Project Structure
```text
fitbuddy/
├── app/
│   ├── schemas.ts          # Shared TypeScript interfaces & schemas
│   ├── models.ts           # Input validation & UserRecord factory
│   ├── database.ts         # Persistent storage & seed athlete data
│   ├── gemini_service.ts   # generateWorkoutPlan, generateNutritionTip, updateWorkoutPlan
│   └── routes.ts           # Express API routes
├── src/
│   ├── assets/images/      # High-resolution athletic & nutrition assets
│   ├── components/
│   │   └── Navbar.tsx      # Responsive 3-zone navigation header
│   ├── pages/
│   │   ├── Home.tsx        # Hero & validated Fitness Profile Form
│   │   ├── Result.tsx      # 7-Day Plan, Nutrition Tip, Print/Download, Quick Feedback
│   │   ├── Feedback.tsx    # Improve My Plan & Original vs Updated Plan comparison
│   │   └── Admin.tsx       # Coach Dashboard, search/filter, and record inspector
│   ├── App.tsx             # Application state & routing
│   ├── index.css           # Typography, dark theme, and print styles
│   └── types.ts            # Frontend type exports
├── server.ts               # Full-stack Express + Vite server entry point
└── README.md               # Project documentation
```

## 11. Safety Disclaimer
> **“FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.”**
>
> FitBuddy is a general wellness application and does not diagnose medical conditions, prescribe medical treatments, or recommend extreme weight-loss practices. Always consult a qualified healthcare or fitness professional before starting a new exercise program.

## 12. Future Improvements
- Wearable activity tracker synchronization for automatic daily workout logging.
- Printable PDF workout log sheets with weekly weight and RPE progression charts.
- Multi-week mesocycle progression blocks (4-week and 8-week periodization).
