CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('LEADER', 'HR', 'ADMIN');
CREATE TYPE survey_domain AS ENUM ('STRESS', 'WORKLOAD', 'RECOVERY', 'SUPPORT');
CREATE TYPE risk_level AS ENUM ('LOW', 'MODERATE', 'HIGH', 'SEVERE');

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'LEADER',
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  domain survey_domain NOT NULL,
  is_negative BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS survey_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reporting_week DATE NOT NULL,
  hours_worked NUMERIC(5,1),
  vacation_days NUMERIC(4,1) DEFAULT 0,
  sick_days NUMERIC(4,1) DEFAULT 0,
  comments TEXT,
  stress_score NUMERIC(5,2) NOT NULL,
  workload_score NUMERIC(5,2) NOT NULL,
  recovery_score NUMERIC(5,2) NOT NULL,
  support_score NUMERIC(5,2) NOT NULL,
  burnout_risk risk_level NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, reporting_week)
);

CREATE TABLE IF NOT EXISTS survey_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES survey_submissions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES survey_questions(id),
  response SMALLINT NOT NULL CHECK (response BETWEEN 1 AND 5),
  UNIQUE(submission_id, question_id)
);

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES survey_submissions(id) ON DELETE CASCADE,
  alert_type VARCHAR(80) NOT NULL,
  message TEXT NOT NULL,
  acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_user_week ON survey_submissions(user_id, reporting_week DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_risk ON survey_submissions(burnout_risk);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);
