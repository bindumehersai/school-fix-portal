# School Facility Condition Reporting & Repair Tracking Portal

A full-stack **MERN** application for reporting, tracking, and resolving school facility issues. Parents, teachers, and admins collaborate to keep every classroom safe and functional.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 18, TypeScript, Vite, React Router, Tailwind CSS, React Hook Form, Axios, Recharts, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas with Mongoose |
| Auth | JWT + bcrypt |
| Image Upload | Cloudinary |
| Deployment | Frontend → Vercel · Backend → Render |

## Roles

- **Parent** — report and track their own issues
- **Teacher** — report and track their own issues
- **Admin** — manage all issues, assign staff, update statuses, delete issues

## Project Structure

```
/
├── frontend/        # React + Vite + TypeScript SPA
│   ├── src/
│   │   ├── api/         # Axios clients (auth, issues, notifications)
│   │   ├── components/  # Reusable UI (Navbar, Sidebar, Card, Modal, etc.)
│   │   ├── context/     # Auth + Toast contexts
│   │   ├── pages/       # 9 pages (Login, Register, Dashboard, ...)
│   │   └── types/       # Shared TypeScript types
└── backend/         # Express + Mongoose REST API
    └── src/
        ├── config/      # db, cloudinary, multer
        ├── controllers/ # auth, user, issue, notification
        ├── middleware/  # auth (JWT + admin), error, validate, notFound
        ├── models/      # User, Issue, Notification
        ├── routes/      # auth, user, issue, notification
        └── utils/       # seed script
```

## Prerequisites

You need accounts and credentials from:

1. **MongoDB Atlas** — free cluster at https://www.mongodb.com/cloud/atlas
2. **Cloudinary** — free account at https://cloudinary.com

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env     # then edit .env with your real credentials
npm install
npm run seed             # creates demo users + sample issues (optional but recommended)
npm run dev              # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env     # set VITE_API_URL to your backend URL
npm install
npm run dev              # starts on http://localhost:5173
```

## Getting Your Credentials

### MongoDB Atlas connection string

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Under **Database Access**, create a database user (username + password)
3. Under **Network Access**, allow your IP (or `0.0.0.0/0` for testing)
4. Click **Connect → Drivers → Node.js**, copy the connection string
5. Replace `<username>`, `<password>`, and `<dbname>` in `MONGO_URI`

### Cloudinary keys

1. Sign up / sign in at https://cloudinary.com
2. Go to the **Dashboard** (https://cloudinary.com/console)
3. Copy `Cloud Name`, `API Key`, and `API Secret` into the backend `.env`

## Demo Accounts (after running `npm run seed`)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.edu | password123 |
| Teacher | teacher@school.edu | password123 |
| Parent | parent@school.edu | password123 |

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Login |
| GET | /api/users/profile | JWT | Get profile |
| PUT | /api/users/profile | JWT | Update profile / change password |
| POST | /api/issues | JWT | Create issue (multipart, with image) |
| GET | /api/issues | JWT | List issues (filtered; admins see all) |
| GET | /api/issues/:id | JWT | Get one issue |
| PUT | /api/issues/:id | JWT | Update issue (admin: status/assign; user: edit own) |
| DELETE | /api/issues/:id | JWT | Delete issue (admin or owner) |
| GET | /api/notifications | JWT | List notifications |
| PUT | /api/notifications/:id | JWT | Mark one as read |
| PUT | /api/notifications/read-all | JWT | Mark all as read |

## Deployment

### Frontend → Vercel
1. Import the repo, set the **Root Directory** to `frontend`
2. Build command: `npm run build` · Output directory: `dist`
3. Add env var `VITE_API_URL` = your Render backend URL

### Backend → Render
1. Create a **Web Service** from the `backend` folder
2. Build: `npm install` · Start: `npm start`
3. Add all env vars from `backend/.env.example` with production values

## Features

- JWT authentication with bcrypt password hashing
- Role-based authorization (parent / teacher / admin)
- Protected routes on the frontend
- Issue reporting with Cloudinary image upload
- Dashboard with stat cards + Recharts pie & bar charts
- Track Issues page with search, filters, status badges, and status timeline
- Notifications center with unread badge and mark-as-read
- Admin panel with statistics, issue management, status assignment, and deletion
- Profile page with edit profile + change password
- Responsive across desktop, tablet, and mobile
- Skeleton loaders, empty states, toast notifications, and animations
