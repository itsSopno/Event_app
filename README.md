# 🌐 Community Event & Volunteer Management Platform

A full-stack web application that connects **organizers** and **volunteers** for community events — hackathons, workshops, meetups, tree plantation drives, and more.

---

## 🔗 Live Links

| Resource | URL |
|---|---|
| 🌍 Live Site | _[https://event-app-phi-inky.vercel.app]_ |
| 🗄️ Backend API | https://community-backend-htx9.onrender.com |
| 📦 GitHub Repo | _[https://github.com/itsSopno/Event_app.git]_ |

---

## 🧪 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Organizer** | siam.dev@example.com | Password123! |
| **Volunteer** | shahriar.vol@example.com | Password123! |

> Create these accounts manually after running the app, or seed them via the backend.

---

## ✨ Features

### 👔 Organizer
- **Dashboard** — Total Events, Upcoming Events, Completed Events, Total Volunteers, Available Slots
- **Create Events** — with title, description, date, location, category, max capacity, required skills, registration deadline, and banner image upload (ImgBB)
- **Draft & Publish** — save as draft first, then publish when ready
- **Manage Events** — edit, publish, close registrations, delete
- **Volunteer Management** — view all volunteers per event with name, email, registration date, selected skill, and participation status
- **Update Volunteer Status** — Registered → Confirmed → Attended → Cancelled
- **Analytics** — events by category (pie chart), volunteer status breakdown (pie chart), registrations per event (bar chart), capacity utilization

### 🙋 Volunteer
- **Browse Events** — search by title, filter by category and upcoming/past
- **Event Detail** — full info with real-time capacity indicator
- **Register for Events** — with skill selection
- **Guards** — prevents duplicate registration, registration after deadline, registration when event is full
- **My Events** — view upcoming & past registrations, cancel upcoming registrations

### 🔒 Auth & Security
- Custom JWT authentication (Express backend)
- Role-based access: **Organizer** and **Volunteer**
- Organizers cannot register as volunteers
- Volunteers cannot access organizer dashboard or modify events
- Route protection via `AuthContext` with automatic redirects

---

## 🤖 AI Feature — Event Description Assistant

Located in: `Create Event` page (organizer only)

**How it works:**
1. The organizer types a short idea, e.g. _"We want to organize a tree plantation program."_
2. The app calls `POST /api/ai/generate-description` on the backend, which uses the **Gemini API** to generate:
   - A full event description
   - Suggested volunteer roles
   - Required skills
   - A short promotional message
3. The generated content is **pre-filled** into the form but is fully editable before publishing.
4. **Fallback**: If the Gemini API is unavailable, a mock response is returned automatically — no error shown to the user.

---

## 📊 Analytics

Located at: `/dashboard/organizer/analytics`

Powered by **Recharts**. Includes:

| Chart | Type | Description |
|---|---|---|
| Events by Category | Pie Chart | Distribution of events across categories |
| Volunteer Status Breakdown | Pie Chart | Registered / Confirmed / Attended / Cancelled count |
| Registrations by Event | Bar Chart | Top 8 events by volunteer sign-up count |
| Capacity Utilization | Progress Bars | % filled per event (green → yellow → red) |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework |
| TypeScript | Language |
| Tailwind CSS v4 | Styling |
| DaisyUI | UI Components |
| Recharts | Analytics Charts |
| Lenis | Smooth Scrolling |
| Lucide React | Icons |
| GSAP | Animations |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | Server |
| TypeScript | Language |
| MongoDB + Mongoose | Database |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password Hashing |
| Gemini API | AI Content Generation |

---

## 🔑 Environment Variables

### Frontend (`Frontend/event-app/.env`)

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=https://community-backend-htx9.onrender.com

# ImgBB API key for banner image uploads
NEXT_PUBLIC_IMGBB_KEY=your_imgbb_api_key

# Better Auth (if used)
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000

# MongoDB (if used from frontend)
MONGODB_URI=your_mongodb_connection_string
```

### Backend (`Backend/.env`)

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/Event

# JWT
JWT_SECRET=your_jwt_secret

# Google Gemini API (AI feature)
GEMINI_API_KEY=your_gemini_api_key

# Server Port
PORT=5000

# CORS origin
CLIENT_URL=http://localhost:3000
```

> ⚠️ Never commit your `.env` files to GitHub. They are already listed in `.gitignore`.

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (or local MongoDB)
- Gemini API key (optional — fallback mock is built-in)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/event-management.git
cd event-management
```

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create `.env` file in `Backend/` with the variables listed above.

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup Frontend

```bash
cd ../Frontend/event-app
npm install
```

Create `.env` file in `Frontend/event-app/` with the variables listed above.

```bash
npm run dev
# App runs on http://localhost:3000
```

---

## 🌍 Deployment

### Frontend — Vercel

```bash
cd Frontend/event-app
npx vercel --prod
```

Set environment variables in the Vercel dashboard under **Project Settings → Environment Variables**.

### Backend — Render

1. Push backend to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set:
   - **Build Command**: `npm run build:prod`
   - **Start Command**: `npm start`
4. Add environment variables in Render dashboard

---

## 📁 Project Structure

```
Event managedment/
├── Backend/                    # Express + TypeScript API
│   ├── src/
│   │   ├── controllers/        # Auth, Events, Registrations, AI
│   │   ├── models/             # User, Event, Registration (Mongoose)
│   │   ├── routes/             # API route definitions
│   │   ├── middleware/         # Auth guard, error handler
│   │   └── server.ts           # Entry point
│   └── package.json
│
└── Frontend/event-app/         # Next.js App Router
    ├── src/
    │   ├── app/
    │   │   ├── dashboard/
    │   │   │   ├── organizer/  # Dashboard, Create, Manage, Volunteers, Analytics
    │   │   │   └── volunteer/  # My Events
    │   │   ├── events/         # Browse Events, Event Detail
    │   │   ├── login/
    │   │   └── singup/
    │   ├── components/
    │   │   ├── layout/         # Navbar, Footer
    │   │   ├── shared/         # LoadingScreen
    │   │   └── providers/      # LenisProvider, AuthProvider
    │   ├── context/            # AuthContext (JWT)
    │   ├── hooks/              # useEvents
    │   └── lib/                # API client
    └── package.json
```

---

## 🎯 Role-Based Authorization

| Action | Organizer | Volunteer | Guest |
|---|---|---|---|
| View Events | ✅ | ✅ | ✅ |
| Register for Event | ❌ | ✅ | ❌ (redirect to login) |
| Create/Edit/Delete Event | ✅ | ❌ | ❌ |
| View Volunteer List | ✅ | ❌ | ❌ |
| Update Volunteer Status | ✅ | ❌ | ❌ |
| View Analytics | ✅ | ❌ | ❌ |
| Cancel Registration | ❌ | ✅ | ❌ |

---

## 🧩 Edge Cases Handled

- ✅ Event full → registration disabled, UI shows "Event full"
- ✅ Past deadline → registration disabled, shows "Registration closed"
- ✅ Duplicate registration → backend rejects, error shown
- ✅ Organizer tries to register as volunteer → blocked with message
- ✅ Deleted event → 404 page shown
- ✅ Unauthorized route access → redirect to login or dashboard
- ✅ Empty states → friendly messages with action buttons
- ✅ Loading states → animated skeleton/pulse indicators
- ✅ Image upload failure → clear error message

---

## 📬 Contact

Built by **Sinners_Code** for Programming Hero — Community Event & Volunteer Management Platform assignment.
