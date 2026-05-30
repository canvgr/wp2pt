# WP2PT — Wolverines Peer-to-Peer Tutoring
### Belen Jesuit Preparatory School · Miami, Florida
*Built by Diego A. Nunez · Ad Majorem Dei Gloriam*

---

## 🚀 Complete Deployment Guide

Follow these steps in order. Estimated total time: **2–3 hours** (most of it is waiting for accounts and DNS).

---

## STEP 1 — Create Accounts (30 min)

### 1a. GitHub
1. Go to **github.com** → Sign Up (free)
2. Verify your email
3. Keep this tab open — you'll use it throughout

### 1b. Vercel
1. Go to **vercel.com** → Sign Up
2. Choose **"Continue with GitHub"** — this links them automatically
3. You'll land on a dashboard

### 1c. Supabase
1. Go to **supabase.com** → Start your project (free)
2. Sign in with GitHub
3. Click **"New Project"**
4. Fill in:
   - Organization: your name or "WP2PT"
   - Project name: `wp2pt`
   - Database password: **save this somewhere safe**
   - Region: **US East (N. Virginia)**
5. Click "Create new project" — wait ~2 minutes for it to set up

### 1d. Resend (for confirmation emails)
1. Go to **resend.com** → Get Started (free)
2. Sign up with your email
3. You'll add this later

---

## STEP 2 — Set Up the Database (20 min)

### 2a. Run the Schema
1. In Supabase, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase-schema.sql` from this project
4. Copy the entire contents and paste into the SQL Editor
5. Click **"Run"** (green button)
6. You should see "Success. No rows returned."

### 2b. Create the Proctor Account
1. In Supabase, click **"Authentication"** → **"Users"** → **"Add user"**
2. Fill in:
   - Email: `proctor@belenjesuit.org` (or whatever email the Proctor will use)
   - Password: choose a secure password
   - Auto Confirm User: ✅ check this
3. Click "Create User"
4. Copy the **UUID** shown next to the new user (looks like: `a1b2c3d4-...`)
5. Go back to **SQL Editor** → New query and run:
   ```sql
   insert into profiles (id, email, first_name, last_name, role)
   values ('PASTE-UUID-HERE', 'proctor@belenjesuit.org', 'Proctor', 'Admin', 'proctor');
   ```
   Replace `PASTE-UUID-HERE` with the actual UUID.

### 2c. Get Your API Keys
1. In Supabase → **Settings** (gear icon) → **API**
2. Copy and save these three values:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role** key (another long string — keep this SECRET)

---

## STEP 3 — Set Up Resend Email (15 min)

1. In Resend → **Domains** → **"Add Domain"**
2. Type `wp2pt.com` → Add
3. Resend will show you DNS records to add (looks like TXT and MX records)
4. Log into **GoDaddy** → My Products → DNS for wp2pt.com
5. Add each DNS record Resend gives you
6. Back in Resend, click **"Verify"** (may take 10–30 min)
7. Go to **API Keys** → **"Create API Key"** → name it `wp2pt-production`
8. Copy the key (starts with `re_`) — you only see it once!

---

## STEP 4 — Deploy the Website (20 min)

### 4a. Upload Code to GitHub
1. Install **Git** on your computer if you don't have it: **git-scm.com/downloads**
2. Open Terminal (Mac) or Command Prompt (Windows)
3. Navigate to the `wp2pt` folder:
   ```bash
   cd path/to/wp2pt
   ```
4. Run these commands one by one:
   ```bash
   git init
   git add .
   git commit -m "Initial WP2PT commit"
   ```
5. On GitHub, click **"New repository"** → name it `wp2pt` → Public → Create
6. Copy the commands GitHub shows you under "push an existing repository" and run them

### 4b. Deploy on Vercel
1. On Vercel → **"Add New Project"**
2. Click **"Import"** next to your `wp2pt` GitHub repository
3. Under **"Environment Variables"**, add these one by one:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
   | `RESEND_API_KEY` | Your Resend API key (`re_...`) |
   | `NEXT_PUBLIC_APP_URL` | `https://wp2pt.com` |

4. Click **"Deploy"**
5. Wait ~2 minutes — Vercel builds the site
6. You'll get a temporary URL like `wp2pt.vercel.app` — the site is live!

---

## STEP 5 — Connect Your GoDaddy Domain (15 min + wait)

1. In Vercel → your project → **Settings** → **Domains**
2. Type `wp2pt.com` → **Add**
3. Also add `www.wp2pt.com`
4. Vercel shows you records like:
   - `A` record → `76.76.21.21`
   - `CNAME` for `www` → `cname.vercel-dns.com`
5. In **GoDaddy** → Domains → wp2pt.com → DNS:
   - Find the existing `A` record → Edit → change value to `76.76.21.21`
   - Add a `CNAME` record: Name = `www`, Value = `cname.vercel-dns.com`
6. Click Save
7. **Wait 10–30 minutes** for DNS to update
8. Visit **wp2pt.com** — your site is live! 🎉

---

## STEP 6 — Test Everything (30 min)

Work through this checklist:

- [ ] Homepage loads at wp2pt.com
- [ ] Student can register with a @belenjesuit.org email
- [ ] Student can log in and navigate to Request Tutoring
- [ ] Student can select Math or Science and pick a course
- [ ] Student can enter an optional grade
- [ ] Student can select a date/time on the calendar
- [ ] Student submits — confirmation page appears
- [ ] Tutor can register and log in
- [ ] Tutor can select multiple courses
- [ ] Tutor can set availability on the calendar
- [ ] When student and tutor overlap on same course + time: both get confirmation emails
- [ ] Proctor can log in with admin credentials
- [ ] Proctor dashboard shows all sessions
- [ ] Proctor can edit student grades
- [ ] Proctor can mark sessions as complete

---

## STEP 7 — Go Live & Announce

Once all tests pass:
1. Share wp2pt.com with students and volunteer tutors
2. Make sure the Proctor has their login credentials
3. Monitor the Supabase dashboard to see sessions coming in

---

## Ongoing Maintenance

**Adding new courses**: Edit `src/lib/courses.ts` — add to `MATH_COURSES` or `SCIENCE_COURSES` array → push to GitHub → Vercel auto-deploys.

**Viewing data directly**: Supabase → Table Editor → browse `sessions`, `profiles`, `tutor_availability`.

**Exporting session records**: Supabase → SQL Editor → run the useful queries at the bottom of `supabase-schema.sql`.

**Resetting a password**: Supabase → Authentication → Users → find user → "Send password reset email."

---

## Project Structure

```
wp2pt/
├── src/
│   ├── app/
│   │   ├── page.tsx                    ← Landing page
│   │   ├── layout.tsx                  ← Nav bar + global layout
│   │   ├── student/
│   │   │   ├── login/page.tsx          ← Student sign in
│   │   │   ├── register/page.tsx       ← Student registration
│   │   │   └── request/page.tsx        ← Step 1 & 2: request tutoring
│   │   ├── tutor/
│   │   │   ├── login/page.tsx          ← Tutor sign in
│   │   │   ├── register/page.tsx       ← Tutor registration
│   │   │   └── availability/page.tsx   ← Step 1 & 2: set availability
│   │   ├── proctor/
│   │   │   ├── login/page.tsx          ← Proctor sign in
│   │   │   └── dashboard/page.tsx      ← Full session dashboard + grades
│   │   └── api/
│   │       └── match/route.ts          ← Matching engine + email trigger
│   ├── lib/
│   │   ├── supabase.ts                 ← Database client
│   │   ├── courses.ts                  ← All course lists + calendar utils
│   │   └── email.ts                    ← Email templates (Resend)
│   └── styles/
│       └── globals.css                 ← Belen navy/gold theme
├── supabase-schema.sql                 ← Run this in Supabase to set up DB
├── .env.local.example                  ← Copy to .env.local with your keys
└── README.md                           ← This file
```

---

*WP2PT — A permanent Belen Jesuit institution, benefiting every Wolverine that follows.*
*Ad Majorem Dei Gloriam*
