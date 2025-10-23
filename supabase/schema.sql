-- Supabase schema for ContentGen
-- Tables: users, content_history, reminders

create extension if not exists "uuid-ossp";

-- users table (mirror of auth.users for quick reference)
create table if not exists public.users (
  id uuid primary key references auth.users(id),
  name text,
  email text unique,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.content_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  type text not null check (type in ('blog', 'caption', 'tweet')),
  input_text text,
  generated_text text,
  created_at timestamptz default now()
);

create table if not exists public.reminders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  topic text,
  date date,
  time time,
  daily boolean default false,
  repeat_days int[],
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists content_history_user_id_idx on public.content_history(user_id);
create index if not exists content_history_created_at_idx on public.content_history(created_at desc);
create index if not exists reminders_user_id_idx on public.reminders(user_id);

-- Row-Level Security: enable
alter table public.content_history enable row level security;
alter table public.reminders enable row level security;
alter table public.users enable row level security;

-- RLS Policies
create policy "Users can read their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on public.users
  for insert with check (auth.uid() = id);

create policy "Users can manage their own content history" on public.content_history
  for all using (auth.uid() = user_id);

create policy "Users can manage their own reminders" on public.reminders
  for all using (auth.uid() = user_id);

-- Function to automatically create user profile on sign up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user profile on sign up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
