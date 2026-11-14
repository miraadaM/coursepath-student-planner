# CoursePath — Student Course Planner

Keep track of the courses you have finished, organize the ones you are taking, and plan the semesters ahead. CoursePath helps students see their progress and build a personal checklist of degree requirements in one place.

## What you can do

- **Track courses:** add and edit courses with completed, in-progress, or planned status.
- **Plan semesters:** group courses by semester and update their status as your plans change.
- **Check requirements:** create major, general education, and elective goals, then assign courses to them.
- **See progress:** track completed courses against an editable course goal and individual requirement targets.
- **Find and manage entries:** search, filter by status, remove a course, and undo its removal while staying on the Courses page.
- **Return later:** course data stays in the same browser after a refresh or reopening the website.

The interface uses a peach-and-white background, pill-shaped navigation, and a responsive layout. No account is required for the current version.

## Current status

**The React application is usable without a database.** It saves courses, requirements, and the overall course goal in browser `localStorage`.

An Express/MongoDB prototype is included in `backend/`, but **the current frontend does not call this API**. Configuring MongoDB alone will not make the website sync across devices. Accounts, per-user storage, and frontend/API integration are future work.

## Run the website locally

### Prerequisites

- Node.js **22.12 or newer** (Node.js 24 is also supported)
- npm, included with Node.js
- Git

```bash
git clone https://github.com/miraadaM/coursepath-student-planner.git
cd coursepath-student-planner/react-frontend
npm ci
npm run dev
```

Open the local address printed by Vite, normally `http://localhost:5173`.

### Build and checks

Run these commands inside `react-frontend/`:

```bash
npm run build     # Create the production build in dist/
npm run preview   # Preview that build locally
npm run lint      # Check the source code
npm test          # Test tracking calculations and data validation
```

For hosting, serve `react-frontend/dist` and configure single-page application fallback to `index.html` so direct visits to `/courses`, `/requirements`, and `/plan` work.

## Using CoursePath

1. Open **Requirements** and enter goals from your degree audit or advisor's checklist.
2. Open **Courses** and add courses, their statuses, and an optional semester.
3. Assign each course to a requirement when applicable.
4. Use **Plan** to see courses grouped by semester.
5. On **Courses**, edit your overall course goal and watch progress update as courses are marked completed.

The initial overall goal is **32 courses**, inherited from the original project. Change it to match your own degree. Only completed courses contribute to completion progress.

## How saving works

Data is saved under `course-tracker.v1` in browser storage. It is specific to the browser, device, and website origin (protocol, hostname, and port).

- Refreshing or closing and reopening the website normally keeps your entries.
- `localhost:5173` and `127.0.0.1:5173` have separate storage. Use the same address consistently.
- Private browsing, clearing site data, or switching devices can make saved entries unavailable.
- There is currently no server backup, account login, or cross-device synchronization.
- If storage is unavailable, the app shows a warning instead of silently claiming the data was saved.

## Optional MongoDB backend

This is a retained prototype, **not the backend used by the current React app**. It has no authentication or per-user ownership, and should remain local until those features are implemented. Its older static pages in `backend/public/` are separate from the redesigned React interface.

To run the API for local development:

```bash
cd backend
npm ci
cp .env.example .env
```

Edit the private `.env` file with your database connection:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/coursepath
PORT=3000
```

The example uses a local MongoDB instance. For Atlas, put your own connection string in `.env`; never put credentials in source code, screenshots, or the README.

```bash
npm start
# Or restart automatically during development:
npm run dev
```

The API starts at `http://127.0.0.1:3000` after the database connects. The prototype supports listing, creating, reading, renaming, and deleting courses under `/api/courses`. The `/api/users` route is unfinished and is not a login system.

## Project structure

```text
coursepath-student-planner/
├── README.md
├── .gitignore
├── react-frontend/
│   ├── src/
│   │   ├── pages/         # Overview, Courses, Requirements, Plan
│   │   ├── components/   # Navigation, forms, course list, progress
│   │   ├── tracker.js    # Progress calculations and storage validation
│   │   └── tracker.test.mjs
│   └── package.json
└── backend/
    ├── .env.example      # Safe configuration example
    ├── app.js
    ├── db.js
    ├── models/
    ├── routes/
    └── public/           # Earlier static interface
```

## Technology

| Area | Tools |
| --- | --- |
| Interface | React 19, React Router, CSS |
| Development and builds | Vite 8, ESLint |
| Current persistence | Browser localStorage |
| Optional API | Node.js, Express, Mongoose, MongoDB |
| Tests | Node.js built-in test runner |

## Configuration and secrets

- `.env` files, private keys, local databases, dependencies, and generated builds are excluded by `.gitignore`.
- Only safe example environment files should be committed.
- MongoDB configuration is read from `MONGO_URI`; connection credentials are not hard-coded.
- Never place database credentials in `VITE_*` variables: frontend configuration is visible to visitors.
- If a credential is ever committed, revoke or rotate it. Adding it to `.gitignore` does not remove it from Git history.

## Scope and future work

CoursePath is a planning aid, not an official graduation audit. It counts **courses rather than credits**, and each course can currently fulfill one requirement in the tracker. It does not verify prerequisites, grades, course availability, or graduation eligibility.

Planned improvements:

- Student accounts and authenticated, per-user MongoDB storage
- Frontend/API integration and cross-device synchronization
- Credit-based requirements and support for courses fulfilling multiple requirements
- Import/export and backups
- Prerequisite and course-availability checks
