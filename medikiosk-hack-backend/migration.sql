-- MediKiosk database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) before starting the server.

create extension if not exists "uuid-ossp";

-- Lightweight intake record used by the demo API. It keeps the full patient
-- submitted payload traceable while the normalized clinical tables evolve.
create table if not exists intake_submissions (
  id uuid primary key,
  token text not null,
  language text not null default 'en',
  identifier text,
  history jsonb not null,
  document_count integer not null default 0,
  priority boolean not null default false,
  created_at timestamptz not null default now()
);

alter table intake_submissions enable row level security;

create table if not exists sos_alerts (
  id uuid primary key,
  token text,
  language text not null default 'en',
  history jsonb not null default '{}'::jsonb,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
alter table sos_alerts enable row level security;

-- ============================================================
-- practitioners
-- ============================================================
create table if not exists practitioners (
  id uuid primary key default uuid_generate_v4(),
  practitioner_id text unique not null,
  name text not null,
  hospital_name text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- patients
-- ============================================================
create table if not exists patients (
  id uuid primary key default uuid_generate_v4(),
  abha_id text,
  name text not null,
  mobile text,
  email text,
  language text default 'en',
  token integer not null,
  ayush_mode boolean default false,
  sos_flag boolean default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- histories
-- ============================================================
create table if not exists histories (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  chief_complaint text,
  hpi jsonb,
  past_medical_history jsonb,
  drug_history text,
  allergy_history text,
  family_history text,
  personal_history text,
  review_of_systems jsonb,
  ayush_data jsonb,
  raw_narration text,
  structured_summary jsonb,
  red_flags boolean default false,
  red_flag_reason text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- documents
-- ============================================================
create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  doc_type text,
  file_url text,
  ocr_text text,
  uploaded_by text, -- 'patient' or a practitioner_id
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_histories_patient_id on histories(patient_id);
create index if not exists idx_documents_patient_id on documents(patient_id);
create index if not exists idx_patients_created_at on patients(created_at);
create index if not exists idx_patients_sos_token on patients(sos_flag desc, token asc);

-- Remember to also create a public/private Storage bucket named
-- SUPABASE_STORAGE_BUCKET (default: "documents") in the Supabase dashboard.
