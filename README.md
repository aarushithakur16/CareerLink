# CareerLink - Internship & Job Listing Portal

CareerLink is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed for students and early-career professionals to discover and apply for curated internships and entry-level job opportunities across 16 tech domains. The platform features a responsive Naukri-inspired interface, advanced multi-parameter search, real-time client validation, and an intuitive administrative portal for listing and applicant management.

---

## Features

### Candidate & Job Seeker Features
- **Unified Naukri-Style Search Bar**: Search seamlessly by keyword (role, company, or skill), experience level, and location from a single header search component.
- **Quick Domain Pills**: One-click quick-filter tags for the top popular domains right below the search bar.
- **Multi-Parameter Filtering**: Filter simultaneously by domain (single select with toggle-off), work type (*Internship* / *Job*), and experience level (*Fresher*, *0-1 years*, *1-2 years*, *2-3 years*).
- **Stable Pagination & Sorting**: Fast server-side pagination (10 items per page) with stable tie-breaker sorting (*Newest* vs *Oldest*) and automatic boundary redirection for out-of-range pages (e.g., `?page=99` resets to `1`).
- **Rich Opportunity Cards**: Includes company initial avatars, experience, stipend/salary, location badges, two-line clamped descriptions, skill chips (`+N more`), and relative posting dates (*"Posted X days ago"*).
- **Opportunity Details & Similar Roles**: Comprehensive role view with a spec grid, full responsibilities, direct apply link, external company portal button, and a dynamic sidebar displaying similar opportunities from the same domain.
- **Client-Side Form Validation**: Application form with instant validation (required fields, valid email format, exact 10-digit phone, 1000-character counter) and prevention of duplicate applications (409 conflict detection).
- **Application Confirmation Page**: Reference ID, applicant contact info, role and company details, persistent across page reloads.
- **Fully Responsive (375px+ Mobile Friendly)**: Seamless mobile experience with a collapsible filter drawer, wrapped pagination controls, and zero horizontal overflow.

### Administrative Features
- **Live Metric Badges**: Live counters for both *Opportunities (54)* and *Candidate Applications* loaded automatically on dashboard mount.
- **Job Posting Management**: Clean administrative table with actions to add, edit, and delete opportunities.
- **Smart Domain Normalization**: Add/Edit modal equipped with an auto-completing datalist of all 16 domains; automatically normalizes casing, trims whitespace, and standardizes spacing upon save.
- **Cascading Deletes**: Deleting an opportunity automatically removes all associated candidate applications to maintain referential integrity.
- **Applicant Review Table**: Admin view to inspect candidate messages, contact details, applied roles, and submission dates, with an instant filter by opportunity.
- **Toast Notifications**: Non-intrusive green success and red error toasts for administrative actions.

---

## Tech Stack

- **Backend**: Node.js, Express.js, Mongoose (MongoDB ODM), dotenv, cors
- **Frontend**: React (Vite), React Router DOM (v7), Axios, Pure CSS (No heavy UI frameworks)
- **Database**: MongoDB (Atlas or Local standalone)
- **Testing**: PowerShell (`test_api.ps1`), Puppeteer-Core (`test_browser.js` with Microsoft Edge/Chrome)

---

## Folder Structure

```text
CareerLink/
├── backend/
│   ├── config/
│   │   └── db.js                        # Database connection setup & error handling
│   ├── controllers/
│   │   ├── applicationController.js     # Applications CRUD & duplicate prevention
│   │   └── opportunityController.js     # Opportunities filtering, search, pagination, skills cleaning
│   ├── middleware/
│   │   └── errorHandler.js              # Central error handler (CastError, ValidationError, 11000) & 404
│   ├── models/
│   │   ├── Application.js               # Application schema with compound unique index
│   │   └── Opportunity.js               # Opportunity schema with domain, type, createdAt indexes
│   ├── routes/
│   │   ├── applicationRoutes.js         # /api/applications router
│   │   └── opportunityRoutes.js         # /api/opportunities router
│   ├── .env.example                     # Backend environment template
│   ├── package.json                     # Dependencies: express, mongoose, dotenv, cors, nodemon
│   ├── seed.js                          # Pre-validation & database seeder (54 records, 16 domains)
│   ├── server.js                        # Express server entry point & CORS configuration
│   └── test_api.ps1                     # 44 automated backend API integration tests
├── frontend/
│   ├── public/                          # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js                   # Central Axios client and error extraction helpers
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx        # Top-level UI crash prevention
│   │   │   ├── FilterSidebar.jsx        # Left multi-parameter filter drawer
│   │   │   ├── Footer.jsx               # CareerLink footer with branding & quick navigation
│   │   │   ├── Navbar.jsx               # Sticky header with active link indicators
│   │   │   ├── OpportunityCard.jsx      # List card with avatars, badges, and skill chips
│   │   │   ├── Pagination.jsx           # Responsive flex-wrapped page switcher
│   │   │   ├── SearchBar.jsx            # Naukri-style 3-part search bar + popular pills
│   │   │   └── Toast.jsx                # Toast alerts for admin actions
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx            # Management dashboard (tabs, modal, applications)
│   │   │   ├── ApplyPage.jsx            # Application form with validation & character count
│   │   │   ├── ConfirmationPage.jsx     # Success confirmation with reference ID
│   │   │   ├── DetailsPage.jsx          # Opportunity details & similar roles panel
│   │   │   ├── ListingsPage.jsx         # Home job/internship listings with URL query state
│   │   │   └── NotFoundPage.jsx         # 404 fallback page
│   │   ├── styles/
│   │   │   └── index.css                # Pure CSS design system with Naukri color palette
│   │   ├── App.jsx                      # Route configurations & layout shell
│   │   └── main.jsx                     # Vite React entry point
│   ├── .env.example                     # Frontend environment template
│   ├── index.html                       # HTML5 entry with CareerLink metadata & Inter font
│   ├── package.json                     # Dependencies: react, react-dom, react-router-dom, axios
│   ├── test_browser.js                  # 27 automated end-to-end Puppeteer browser tests
│   └── vite.config.js                   # Vite config (port 5173 with strictPort: true)
├── .gitignore                           # Ignores node_modules, .env, dist, and .DS_Store
├── README.md                            # Complete technical project documentation
└── SCREENSHOTS_CHECKLIST.md             # Submission guide for project screen captures
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: An active MongoDB Atlas cluster or a running local MongoDB instance (`mongodb://127.0.0.1:27017`)
- **PowerShell**: Windows PowerShell 5.1+ (for automated backend test script)
- **Microsoft Edge or Google Chrome**: Installed on the system (for Puppeteer browser testing)

---

## Step-by-Step Setup

### 1. Clone & Configure Environment

Clone the repository and enter the project folder:
```bash
git clone <repository-url>
cd CareerLink
```

#### Backend Environment Setup
Create `backend/.env` using the provided template:
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and configure:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/careerlink?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```
*Note: If using local MongoDB, set `MONGO_URI=mongodb://127.0.0.1:27017/careerlink`.*

#### Frontend Environment Setup
Create `frontend/.env` using the provided template:
```bash
cp frontend/.env.example frontend/.env
```
Ensure `frontend/.env` contains:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 2. Install Dependencies

Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

---

### 3. Seed Database (54 Opportunities across 16 Domains)

The seeder performs pre-validations (in-memory Mongoose validation, exact counts per domain, 36 internships / 18 jobs, unique companies, unique links, no prohibited "c++" text, past timestamps) before writing to the database:

```bash
cd backend
npm run seed
cd ..
```

**Expected Seeder Output:**
```text
Running pre-seed validation checks...
All pre-seed validation checks PASSED successfully!
Connecting to MongoDB...
Connected to MongoDB.
Clearing existing Opportunity and Application collections...
Inserting seed records into database...

--- Database Verification Summary ---
Total Opportunities: 54
Distinct Domains Count: 16
Unique CreatedAt Timestamps: 54
Database seeded and verified successfully!
```

---

### 4. Running the Application

Open two separate terminal windows or run in background:

#### Terminal 1: Backend Server (Port 5000)
```bash
cd backend
npm start
# Or for development with live reload:
npm run dev
```

#### Terminal 2: Frontend Server (Port 5173)
```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:5173` to explore **CareerLink**.

---

## REST API Endpoints

All responses follow the unified JSON structure:
`{ "success": true | false, "data": ..., "message": "..." }`

### Opportunity Endpoints (`/api/opportunities`)
| Method | Endpoint | Query Parameters / Body | Description |
|---|---|---|---|
| `GET` | `/api/opportunities` | `search`, `domain`, `type`, `experience`, `location`, `sort` (`newest`\|`oldest`), `page`, `limit` | Returns paginated opportunities with `{ total, page, pages, limit }`. Clamped to max 50 items. |
| `GET` | `/api/opportunities/domains` | None | Returns distinct domains sorted A to Z (defined before `/:id`). |
| `GET` | `/api/opportunities/:id` | None | Retrieves a single opportunity by MongoDB ObjectId (400 if invalid, 404 if not found). |
| `POST` | `/api/opportunities` | JSON body (allowed fields only) | Creates a new opportunity. Cleans skills (trims, dedupes, max 8, max 30 chars). |
| `PUT` | `/api/opportunities/:id` | JSON body | Updates allowed fields and runs schema validators. |
| `DELETE`| `/api/opportunities/:id` | None | Deletes the opportunity and all associated applications in a single operation. |

### Application Endpoints (`/api/applications`)
| Method | Endpoint | Query Parameters / Body | Description |
|---|---|---|---|
| `POST` | `/api/applications` | `{ opportunity, name, email, phone, message }` | Submits an application. Returns 404 if opportunity missing, 409 if duplicate `(opportunity, email)`. |
| `GET` | `/api/applications` | Optional `?opportunity=<id>` | Admin list of applications, populated with opportunity title & company, sorted newest first. |
| `GET` | `/api/applications/:id` | None | Retrieves a single populated application by ID (used by the confirmation page). |

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Returns `{ "success": true, "data": null, "message": "CareerLink API is up and running" }`. |

---

## Database Schema Structure

### Collection: `opportunities`
| Field Name | Type | Required | Constraints & Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key | Unique MongoDB ID |
| `title` | String | Yes | Trimmed | Role title (e.g., *"React Developer Intern"*) |
| `company` | String | Yes | Trimmed | Fictional company name (e.g., *"PixelCraft Labs"*) |
| `domain` | String | Yes | Trimmed, Indexed | One of the 16 tech domains |
| `location` | String | Yes | Trimmed, must contain `(` | E.g., *"Bengaluru, India (Remote)"* |
| `experience`| String | Yes | Enum: `['Fresher', '0-1 years', '1-2 years', '2-3 years']` | Required experience level |
| `description`| String | Yes | Trimmed | Detailed responsibilities (150-350 chars) |
| `applicationLink`| String | Yes | Regex `/^https?:\/\/.+/` | External link for application |
| `type` | String | Yes | Enum: `['Internship', 'Job']`, Default: `'Internship'`, Indexed | Opportunity type |
| `skills` | Array of Strings | No | Controller cleans to max 8 items, max 30 chars each | E.g., `["React", "JavaScript", "CSS"]` |
| `salary` | String | No | Max length 60 chars | E.g., *"₹15,000 - ₹25,000 /month"*, *"₹4 - 6 LPA"* |
| `createdAt` | Date | Auto | Indexed | Timestamp (explicit past date in seeds) |
| `updatedAt` | Date | Auto | — | Last update timestamp |

### Collection: `applications`
| Field Name | Type | Required | Constraints & Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key | Unique reference ID |
| `opportunity` | ObjectId | Yes | References `Opportunity` | Target opportunity ID |
| `name` | String | Yes | Trimmed, Max 100 chars | Candidate full name |
| `email` | String | Yes | Lowercase, Trimmed, Valid email regex | Candidate email |
| `phone` | String | Yes | Trimmed, Exactly 10 digits regex `/^\d{10}$/` | Candidate contact number |
| `message` | String | No | Trimmed, Max 1000 chars | Candidate message / pitch |
| `createdAt` | Date | Auto | — | Submission timestamp |
| `updatedAt` | Date | Auto | — | Last update timestamp |

*Compound Unique Index*: `{ opportunity: 1, email: 1 }` prevents the same candidate from applying twice to the same posting.

---

## Automated Test Results

### 1. Backend Integration Tests (`backend/test_api.ps1`)
Executed via PowerShell against `http://localhost:5000`:
- **Total Tests Executed**: 44
- **Passed**: 44
- **Failed**: 0
- **Summary**: All 44 tests passed covering health check, pagination boundaries, regex character escaping (`c++`, `(`, `[`), all 16 domain queries, type/experience/location filters, sorting stability, ID validation (valid, invalid, 404), CRUD lifecycle, duplicate prevention (409), input validation (bad email, non-10 digit phone), and cascading deletion.

### 2. Frontend End-to-End Browser Tests (`frontend/test_browser.js`)
Executed via Puppeteer-Core with Microsoft Edge against `http://localhost:5173`:
- **Total Tests Executed**: 27
- **Passed**: 27
- **Failed**: 0
- **Summary Table**:

| # | Feature / Endpoint | Test Description | Expected | Actual | Status |
|---|---|---|---|---|---|
| 01 | `GET /` | Initial listings load | 10 cards, total 54 | 10 cards, "Showing 1-10 of 54 opportunities" | **PASS** |
| 02 | Search Keyword | Search by keyword "Developer" | Cards > 0 | 10 cards found | **PASS** |
| 03 | Search Skill | Search by skill "React" | Cards >= 2 | 6 cards found | **PASS** |
| 04 | Search "c++" | Search "c++" (safe regex, 0 results) | "No opportunities found" | "No opportunities found" | **PASS** |
| 05 | Clear Filters | Click Clear all filters | 10 cards rendered, total 54 | 10 cards | **PASS** |
| 06 | Location Filter | Filter location "Bengaluru" | Cards > 0 | 10 cards | **PASS** |
| 07 | Experience Filter | Filter experience "Fresher" | Total 36 opportunities | "Showing 1-10 of 36 opportunities" | **PASS** |
| 08 | Domain Filters | Test ALL 16 domains in sidebar | All 16 domains return > 0 cards | All 16 domains passed | **PASS** |
| 09 | Type Filter | Filter by Job & Internship | Job: 18, Internship: 36 | Job: "18", Internship: "36" | **PASS** |
| 10 | Combined Filters | Type (Job) + Experience (1-2 years) | Cards > 0 | 10 cards found | **PASS** |
| 11 | Sort Order | Sort Newest vs Oldest | Titles differ between orders | Newest != Oldest | **PASS** |
| 12 | Pagination 1..6 | Fetch all 6 pages & check uniqueness | 54 unique opportunities | 54 unique items | **PASS** |
| 13 | Page 99 Redirect | Redirect ?page=99 to page 1 | URL replaces to page=1 | `http://localhost:5173/?page=1` | **PASS** |
| 14 | Back Button | Back button preserves filters | Retains domain filter | `http://localhost:5173/?domain=Web%20Development` | **PASS** |
| 15 | `/opportunity/:id` | Details page with specs & similar | Title, specs, up to 4 similar | Title, Specs: true, Similar: 3 | **PASS** |
| 16 | `/opportunity/invalid`| Friendly Not Found page | "Opportunity Not Found" | "Opportunity Not Found" | **PASS** |
| 17 | `/apply/:id` (Validation) | Client-side required validation | Errors for name, email, phone | 3 error messages displayed | **PASS** |
| 18 | POST Application | Submit valid application | Confirmation page with Ref ID | "Application Submitted!", Ref displayed | **PASS** |
| 19 | `/confirmation/:id` | Persists on reload via GET API | Ref ID matches after reload | Ref ID preserved | **PASS** |
| 20 | Duplicate App (409) | Duplicate email error alert | Shows duplicate message | 409 conflict alert displayed | **PASS** |
| 21 | `/admin` (Counts) | Tab counts on mount | Opportunities (54), Apps (1) | Opportunities (54) \| Apps (1) | **PASS** |
| 22 | Admin Add Opp | Add opp + lowercase domain normalisation | Toast shown, domain standardized | "Cloud & DevOps" saved | **PASS** |
| 23 | Admin Edit Opp | Edit opportunity details | Success toast shown | Opportunity edited | **PASS** |
| 24 | Admin Delete Opp | Delete opp with confirm dialog | Removed, toast shown | Opportunity deleted | **PASS** |
| 25 | Admin Applications | Applications table display | Candidate Alex Mercer shown | Row rendered with details | **PASS** |
| 26 | 404 Page | Unknown route fallback | "Page Not Found" | "Page Not Found" | **PASS** |
| 27 | Mobile 375px Layout | Responsive check (no horizontal scroll) | scrollWidth <= 375, drawer opens | Overflow: false, Drawer: true | **PASS** |

### 3. Production Build & Linter Check
- `npm run build` in `frontend/`: Built in 1.66s with 0 errors.
- `npm run lint` in `frontend/`: Passed cleanly with no problems found.

---

## Troubleshooting Guide

| Issue | Root Cause | Solution |
|---|---|---|
| **MongoDB connection error (`connect ECONNREFUSED` or `ETIMEDOUT`)** | MongoDB service is not running locally, or `MONGO_URI` is incorrect. | Check `backend/.env`. If using local MongoDB, ensure `mongod` is running on port 27017. If using Atlas, confirm your current IP address is whitelisted in Atlas Network Access. |
| **Port 5000 is already in use (`EADDRINUSE`)** | Another process is already running on port 5000. | Stop the old process: in PowerShell run `Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess \| Stop-Process -Force`, then restart the server. |
| **Port 5173 is already in use** | A previous Vite dev server instance is still occupying port 5173. | Because `strictPort: true` is configured in `vite.config.js`, Vite will intentionally fail rather than shifting ports. Terminate the running node process on 5173 before launching. |
| **CORS blocked error in browser console** | `CLIENT_URL` in `backend/.env` does not match the frontend origin. | Ensure `backend/.env` has `CLIENT_URL=http://localhost:5173` without trailing slashes. |
| **Missing `.env` configuration** | `.env` was not created from `.env.example`. | Copy `.env.example` to `.env` in both `backend/` and `frontend/` and provide valid configurations. |
| **Missing `node_modules`** | Dependencies were not installed. | Run `npm install` inside both `backend/` and `frontend/` directories. |

---

## Future Improvements

Features planned for upcoming release phases:
- **Authentication & RBAC**: JWT and bcrypt based secure candidate login, company recruiter login, and password hashing.
- **Resume & Portfolio Uploads**: Cloud-backed PDF resume uploads (AWS S3 or Cloudinary) with document previewers.
- **Email Notifications**: Automated transactional emails via SendGrid or Nodemailer for application confirmation and candidate shortlisting.
- **Saved Opportunities & Bookmarks**: Candidate dashboard to bookmark jobs and track active application statuses.
- **Recruiter Job Posting Management**: Multi-tenant recruiter portal allowing companies to manage their own job listings and schedule interviews.

