-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create extension if not exists pgcrypto;

create table pages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  page_id text not null unique,
  access_token text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table comment_templates (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table dm_templates (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  button_label text not null default 'Get Access',
  link text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Only stores comment IDs to avoid double-replying (webhook retries / restarts),
-- not the reply content itself.
create table processed_comments (
  comment_id text primary key,
  created_at timestamptz not null default now()
);
