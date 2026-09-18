# MSBTE Study Portal

A React + Vite multi-file project for the MSBTE Study Portal.

## Project Structure

```
msbte-portal/
├── index.html                        ← HTML entry point
├── package.json                      ← dependencies (React 18, Firebase 10, Vite 5)
├── vite.config.js                    ← Vite configuration
└── src/
    ├── main.jsx                      ← ReactDOM entry
    ├── App.jsx                       ← Root app + routing
    ├── index.css                     ← All global styles
    ├── firebase.js                   ← Firebase init + Firestore helpers
    ├── constants.js                  ← BRANCHES, SEMS, utility functions
    ├── toast.jsx                     ← Toast notification system
    ├── components/
    │   ├── Navbar.jsx                ← Top navigation bar
    │   ├── Footer.jsx                ← Site footer
    │   └── PdfModal.jsx              ← PDF viewer modal
    └── pages/
        ├── HomePage.jsx              ← Landing / home page
        ├── BrowsePage.jsx            ← Browse model answer papers
        ├── ManualPage.jsx            ← Practical manual answers
        ├── SyllabusPage.jsx          ← K-Scheme syllabus
        ├── ManualPdfPage.jsx         ← Downloadable manual PDFs
        └── OtherPages.jsx            ← Contact, Login, Admin, Privacy, About
```

## Setup & Run

### Prerequisites
- Node.js 18+ installed
- npm 9+

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start development server (opens at http://localhost:5173)
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```
How To Run This project :-
1.First run npm install
2.npm run dev
3.And go to the localhost
Project link:-Directly see the project online
https://msbte-portal.vercel.app/
## Deploy

After `npm run build`, upload the contents of the `dist/` folder to any static host:
- **Netlify** — drag & drop the `dist/` folder
- **Vercel** — connect repo or deploy via CLI
- **Firebase Hosting** — `firebase deploy`
- **GitHub Pages** — push `dist/` contents

## Why This Works (vs the single-file approach)

The original single file used `<script type="text/babel">` with inline JSX, which only works
for **inline** scripts — the Babel standalone CDN cannot transform external `.jsx` files loaded
via `src="..."`. This project uses **Vite**, which compiles JSX at build time (or in dev via
fast HMR), so all `.jsx` files work perfectly as separate modules.

## Firebase

The Firebase project credentials are already set in `src/firebase.js`. No changes needed unless
you want to point to a different Firebase project.
