# Quick.ai — AI SaaS Platform 🚀

A modern full-stack AI SaaS dashboard to generate articles, craft blog titles, create AI images, remove backgrounds privately in-browser, and get resume reviews.

🔗 **Live Application:** [quick-ai-hvil.vercel.app](https://quick-ai-hvil.vercel.app/)

---

## ✨ Features

- **AI Article Writer:** Generate structured, long-form articles (400, 700, 1000 words).
- **Blog Title Generator:** Suggests SEO-friendly titles categorized by difficulty.
- **AI Image Generation:** Text-to-image generator with community publishing & likes.
- **Zero-Server Background Removal:** Powered entirely client-side via WebAssembly (100% private, zero API cost).
- **AI Resume Reviewer:** PDF text extraction with instant actionable feedback.
- **Auth & Tier Limits:** Clerk authentication with server-verified credit limits (Free: 10 generations, Premium: unlimited).

---

## 🛠️ Tech Stack

- **Client:** React (Vite), Tailwind CSS v4, Lucide Icons, Axios, React Router
- **Server:** Node.js, Express.js, PostgreSQL (Neon Serverless)
- **AI & Storage:** Google Gemini API, Pollinations.ai, Cloudinary, Multer
- **DevOps:** Docker, Docker Compose (Multi-container orchestration)

---

## 🏗️ Architectural Highlights

1. **Client-Side Image Processing:** Used `@imgly/background-removal` directly in the browser to eliminate third-party server costs and keep user photos strictly private.
2. **Secure Tier Validation:** Credit checks are validated server-side against Clerk's private session metadata before triggering AI APIs.
3. **Dockerized Environment:** Isolated client and server containers configured via Docker Compose to ensure a reproducible setup on any OS.

---

## 🚀 Getting Started

### Method 1: Docker Compose (Recommended) 🐳

Ensure Docker Desktop is running, then execute:

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/quick-ai.git
cd quick-ai

# 2. Start the full application stack
docker compose up --build
```
## Manual Setup
# Backend Setup
cd server
npm install
nodemon server.js

# Frontend Setup 
cd client
npm install
npm run dev


## Environment Configuration ##
DATABASE_URL=your_neon_postgres_url
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PORT=5000

client/.env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:5000

## Database Setup ##
Run this schema query inside your Neon PostgreSQL SQL editor:
CREATE TABLE "Creation" (
  id SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  publish BOOLEAN DEFAULT false,
  likes TEXT[] DEFAULT '{}',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

👨‍💻 Author

Dhiraj Kumar
Github- github.com/Dhiraj-student-101
Linkedin-linkedin.com/in/dhiraj-kumar
