-- ===============================================================
-- Database Schema: Job Application Tracker
-- Target RDBMS: PostgreSQL 14+
-- ===============================================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index on user email for fast authentication lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);


-- 2. Create Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    job_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Applied' CHECK (
        status IN ('Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn')
    ),
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    salary VARCHAR(50),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes on applications for user isolation and rapid querying
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_company ON applications(company);
CREATE INDEX IF NOT EXISTS idx_applications_date ON applications(application_date DESC);


-- 3. Create Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    interview_date TIMESTAMPTZ NOT NULL,
    interview_type VARCHAR(50) NOT NULL,
    interviewer VARCHAR(100),
    notes TEXT,
    result VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (
        result IN ('Pending', 'Passed', 'Failed', 'Cancelled')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes on interviews for fast relation traversal and calendar sorting
CREATE INDEX IF NOT EXISTS idx_interviews_application_id ON interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_date ON interviews(interview_date ASC);
