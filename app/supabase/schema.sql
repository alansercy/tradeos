-- TradeOS Database Schema
-- Run in Supabase SQL Editor

-- Extensions
create extension if not exists "uuid-ossp";

-- Crew table
create table if not exists crew (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  initials text not null,
  role text not null default 'electrician',
  created_at timestamptz not null default now()
);

-- Jobs table
create table if not exists jobs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  gc_name text not null,
  gc_contact text,
  location text,
  phase text not null check (phase in ('rough-in', 'service', 'trim-out', 'inspection', 'complete')),
  crew uuid[] not null default '{}',
  margin numeric(5,2) not null default 0,
  contract_value numeric(12,2) not null default 0,
  status text not null default 'active' check (status in ('active', 'pipeline', 'complete')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  deadline date,
  created_at timestamptz not null default now()
);

-- Materials table
create table if not exists materials (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade,
  item text not null,
  quantity numeric(10,2) not null default 1,
  unit text not null default 'ea',
  source text,
  status text not null default 'needed' check (status in ('on-site', 'ordered', 'needed')),
  notes text,
  created_at timestamptz not null default now()
);

-- Invoices table
create table if not exists invoices (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade,
  invoice_number text not null unique,
  client text not null,
  amount numeric(12,2) not null,
  sent_date date not null,
  days_outstanding integer not null default 0,
  follow_up_status text not null default 'none' check (follow_up_status in ('none', 'sent', 'responded')),
  follow_up_note text,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_materials_job_id on materials(job_id);
create index if not exists idx_invoices_job_id on invoices(job_id);
create index if not exists idx_jobs_status on jobs(status);

-- RLS (disable for internal app — enable + add policies if auth is added later)
alter table crew enable row level security;
alter table jobs enable row level security;
alter table materials enable row level security;
alter table invoices enable row level security;

-- Allow full access with service role (used by admin client)
create policy "service role full access" on crew for all using (true);
create policy "service role full access" on jobs for all using (true);
create policy "service role full access" on materials for all using (true);
create policy "service role full access" on invoices for all using (true);
