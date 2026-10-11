# Quick.ai

An AI SaaS dashboard where you can write articles, generate blog titles, create images, remove image backgrounds and get your resume reviewed, all from one place.

**Live demo:** https://quick-ai-hvil.vercel.app/

---

## What it does

| Feature | Description |
| --- | --- |
| Write Article | Pick a topic and a length (400, 700 or 1000 words) and get a formatted article. |
| Blog Titles | Enter a keyword and a category and get titles grouped by difficulty. |
| Generate Images | Describe an image, choose a style, and download the result. You can also publish it to the community. |
| Remove Background | Runs entirely in your browser, so your photo is never uploaded anywhere. |
| Review Resume | Upload a PDF and get feedback on strengths, weaknesses and improvements. |
| Community | Browse images published by other users and like the ones you enjoy. |
| Dashboard | See your total creations, your active plan and your recent history. |
| Plans | Free users get 10 generations. Premium (Clerk Billing) removes the limit. |

## Tech stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Clerk, Axios, react-markdown

**Backend:** Node.js, Express, PostgreSQL (Neon), Cloudinary, Multer

**AI and processing:** Google Gemini (text and resume review), Pollinations.ai (image generation), `@imgly/background-removal` (in-browser background removal), `unpdf` (PDF text extraction)

## Why it is built this way

- **Auth and billing with Clerk.** The server reads the user's plan from the session token, so it never has to trust the client.
- **Usage limits on the server.** Free usage is counted in Clerk's private metadata and checked on every request.
- **Background removal in the browser.** This keeps it free, fast and private, with no third-party API key needed.
- **Raw SQL instead of an ORM.** The data model is small, so plain queries on Neon were enough.

## Running it locally

You will need Node.js 18+, a Neon database, a Clerk app, a Cloudinary account and a Gemini API key.

```bash
# 1. Clone
git clone https://github.com/<your-username>/quick-ai.git
cd quick-ai

# 2. Backend
cd server
npm install
npm run dev        # runs nodemon server.js

# 3. Frontend (in a new terminal)
cd client
npm install
npm run dev
```

### Environment variables

`server/.env`

```env
DATABASE_URL=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
GEMINI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=3000
```

`client/.env`

```env
VITE_CLERK_PUBLISHABLE_KEY=
VITE_BASE_URL=http://localhost:3000
```

### Database

Create this table in the Neon SQL editor:

```sql
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
```

## API

All routes require a Clerk bearer token.

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/ai/generate-article` | Generate an article |
| POST | `/api/ai/generate-blog-title` | Generate blog titles |
| POST | `/api/ai/generate-image` | Generate an image |
| POST | `/api/ai/resume-review` | Review an uploaded PDF resume |
| GET | `/api/user/get-creations` | Current user's history and plan |
| GET | `/api/user/get-published-creations` | Public community feed |
| POST | `/api/user/toggle-like-creation` | Like or unlike a creation |

## Known limitations

- **Remove Object** is not working yet. It depends on a Cloudinary add-on that is not enabled on the free tier.
- The backend runs on a free tier, so the first request after a period of inactivity can be slow.
- Gemini's free tier has a daily request cap, so heavy testing can hit rate limits.

## Author

**Dhiraj Kumar**

[GitHub](https://github.com/<your-username>) · [LinkedIn](https://linkedin.com/in/<your-handle>)
