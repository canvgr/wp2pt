-- ============================================================
-- WP2PT — Wolverines Peer-to-Peer Tutoring
-- Supabase SQL Schema
-- Run this entire file in: Supabase → SQL Editor → New Query
-- ============================================================

-- PROFILES TABLE
-- Stores all users: students, tutors, and proctors
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  first_name text not null,
  last_name text not null,
  role text not null check (role in ('student', 'tutor', 'proctor')),
  graduation_year int,
  created_at timestamptz default now()
);

-- Allow users to read/write their own profile
alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Proctors can read all profiles
create policy "Proctors can read all profiles"
  on profiles for select using (
    exists (
      select 1 from profiles p where p.id = auth.uid() and p.role = 'proctor'
    )
  );


-- SESSIONS TABLE
-- One row per tutoring session request
create table if not exists sessions (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references profiles(id) on delete cascade not null,
  tutor_id uuid references profiles(id) on delete set null,
  subject text not null check (subject in ('math', 'science')),
  course text not null,
  student_grade int check (student_grade >= 0 and student_grade <= 100),
  session_date date not null,
  session_time text not null,
  duration int not null check (duration in (15, 30)),
  status text not null default 'pending' check (status in ('pending', 'matched', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

alter table sessions enable row level security;

-- Students can see and insert their own sessions
create policy "Students can read own sessions"
  on sessions for select using (auth.uid() = student_id);

create policy "Students can insert sessions"
  on sessions for insert with check (auth.uid() = student_id);

-- Tutors can see sessions they're matched to
create policy "Tutors can see their sessions"
  on sessions for select using (auth.uid() = tutor_id);

-- Proctors can see all sessions and update them (for grade tracking)
create policy "Proctors can read all sessions"
  on sessions for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'proctor')
  );

create policy "Proctors can update sessions"
  on sessions for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'proctor')
  );

-- Service role can update sessions (for the matching API)
create policy "Service role can update sessions"
  on sessions for update using (true);


-- TUTOR_AVAILABILITY TABLE
-- One row per available time slot a tutor registers
create table if not exists tutor_availability (
  id uuid default gen_random_uuid() primary key,
  tutor_id uuid references profiles(id) on delete cascade not null,
  subject text not null check (subject in ('math', 'science')),
  courses text[] not null,
  available_date date not null,
  available_time text not null,
  duration int not null check (duration in (15, 30)),
  is_booked boolean default false,
  created_at timestamptz default now()
);

alter table tutor_availability enable row level security;

-- Tutors can manage their own availability
create policy "Tutors can read own availability"
  on tutor_availability for select using (auth.uid() = tutor_id);

create policy "Tutors can insert availability"
  on tutor_availability for insert with check (auth.uid() = tutor_id);

create policy "Tutors can delete own availability"
  on tutor_availability for delete using (auth.uid() = tutor_id);

-- Service role can read all availability and mark as booked (for matching)
create policy "Service role can read all availability"
  on tutor_availability for select using (true);

create policy "Service role can update availability"
  on tutor_availability for update using (true);


-- ============================================================
-- SEED: Create a Proctor account
-- After running this, go to Supabase → Authentication → Users
-- and manually create a user with role = proctor
-- OR run this after creating the auth user:
-- ============================================================
-- insert into profiles (id, email, first_name, last_name, role)
-- values ('PASTE-UUID-FROM-AUTH-USER-HERE', 'proctor@belenjesuit.org', 'Proctor', 'Admin', 'proctor');


-- ============================================================
-- USEFUL QUERIES FOR PROCTORS (run in SQL Editor anytime)
-- ============================================================

-- All upcoming matched sessions:
-- select s.session_date, s.session_time, s.duration, s.course,
--        p_s.first_name || ' ' || p_s.last_name as student,
--        p_t.first_name || ' ' || p_t.last_name as tutor,
--        s.student_grade, s.status
-- from sessions s
-- join profiles p_s on s.student_id = p_s.id
-- left join profiles p_t on s.tutor_id = p_t.id
-- where s.status = 'matched'
-- order by s.session_date, s.session_time;

-- Tutor service hours:
-- select p.first_name || ' ' || p.last_name as tutor,
--        count(*) as sessions_completed,
--        sum(s.duration) / 60.0 as total_hours
-- from sessions s
-- join profiles p on s.tutor_id = p.id
-- where s.status = 'completed'
-- group by tutor order by total_hours desc;
