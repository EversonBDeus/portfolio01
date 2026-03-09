--  =========== Funções Base ================
--  ----------- Updated At --------------

create or replace function public.set_row_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

--  =========== Tabelas do Backend MVP ================
--  ----------- Conta do Produto --------------

create table if not exists public.user_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  plan text not null default 'free' check (plan in ('free', 'plus', 'pro')),
  onboarding_status text not null default 'not_started' check (
    onboarding_status in ('not_started', 'in_progress', 'completed')
  ),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

--  ----------- Perfil Público --------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  public_name text not null default '',
  headline text not null default '',
  bio text not null default '',
  location text not null default '',
  public_email text not null default '',
  linkedin text not null default '',
  github text not null default '',
  website text not null default '',
  whatsapp text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

--  ----------- Dados Profissionais --------------

create table if not exists public.professional_data (
  id uuid primary key references auth.users(id) on delete cascade,
  role_title text not null default '',
  professional_summary text not null default '',
  work_area text not null default '',
  experience_level text not null default '',
  main_skills jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

--  ----------- Configurações do Portfólio --------------

create table if not exists public.portfolio_settings (
  id uuid primary key references auth.users(id) on delete cascade,
  template_id text,
  public_slug text not null,
  publication_status text not null default 'draft' check (
    publication_status in ('draft', 'published')
  ),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists portfolio_settings_public_slug_idx
  on public.portfolio_settings (public_slug);

--  ----------- Estado do Editor --------------

create table if not exists public.portfolio_editor (
  id uuid primary key references auth.users(id) on delete cascade,
  template_id text,
  device text not null default 'desktop' check (device in ('desktop', 'mobile')),
  active_section text not null default 'hero' check (
    active_section in ('hero', 'about', 'projects', 'contact')
  ),
  active_project_id text,
  visibility jsonb not null default '{"hero": true, "about": true, "projects": true, "contact": true}'::jsonb,
  hero jsonb not null default '{"publicName":"","headline":"","roleTitle":"","location":"","skillsText":""}'::jsonb,
  about jsonb not null default '{"summary":""}'::jsonb,
  contact jsonb not null default '{"publicEmail":"","whatsapp":"","website":"","linkedin":"","github":""}'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

--  =========== Triggers de Updated At ================
--  ----------- Tabelas Públicas --------------

drop trigger if exists user_accounts_set_updated_at on public.user_accounts;
create trigger user_accounts_set_updated_at
before update on public.user_accounts
for each row
execute procedure public.set_row_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute procedure public.set_row_updated_at();

drop trigger if exists professional_data_set_updated_at on public.professional_data;
create trigger professional_data_set_updated_at
before update on public.professional_data
for each row
execute procedure public.set_row_updated_at();

drop trigger if exists portfolio_settings_set_updated_at on public.portfolio_settings;
create trigger portfolio_settings_set_updated_at
before update on public.portfolio_settings
for each row
execute procedure public.set_row_updated_at();

drop trigger if exists portfolio_editor_set_updated_at on public.portfolio_editor;
create trigger portfolio_editor_set_updated_at
before update on public.portfolio_editor
for each row
execute procedure public.set_row_updated_at();

--  =========== Row Level Security ================
--  ----------- Enable RLS --------------

alter table public.user_accounts enable row level security;
alter table public.profiles enable row level security;
alter table public.professional_data enable row level security;
alter table public.portfolio_settings enable row level security;
alter table public.portfolio_editor enable row level security;

--  ----------- Policies de user_accounts --------------

drop policy if exists "user_accounts_select_own" on public.user_accounts;
create policy "user_accounts_select_own"
on public.user_accounts
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "user_accounts_insert_own" on public.user_accounts;
create policy "user_accounts_insert_own"
on public.user_accounts
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "user_accounts_update_own" on public.user_accounts;
create policy "user_accounts_update_own"
on public.user_accounts
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "user_accounts_delete_own" on public.user_accounts;
create policy "user_accounts_delete_own"
on public.user_accounts
for delete
to authenticated
using (auth.uid() = id);

--  ----------- Policies de profiles --------------

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
on public.profiles
for delete
to authenticated
using (auth.uid() = id);

--  ----------- Policies de professional_data --------------

drop policy if exists "professional_data_select_own" on public.professional_data;
create policy "professional_data_select_own"
on public.professional_data
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "professional_data_insert_own" on public.professional_data;
create policy "professional_data_insert_own"
on public.professional_data
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "professional_data_update_own" on public.professional_data;
create policy "professional_data_update_own"
on public.professional_data
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "professional_data_delete_own" on public.professional_data;
create policy "professional_data_delete_own"
on public.professional_data
for delete
to authenticated
using (auth.uid() = id);

--  ----------- Policies de portfolio_settings --------------

drop policy if exists "portfolio_settings_select_own" on public.portfolio_settings;
create policy "portfolio_settings_select_own"
on public.portfolio_settings
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "portfolio_settings_insert_own" on public.portfolio_settings;
create policy "portfolio_settings_insert_own"
on public.portfolio_settings
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "portfolio_settings_update_own" on public.portfolio_settings;
create policy "portfolio_settings_update_own"
on public.portfolio_settings
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "portfolio_settings_delete_own" on public.portfolio_settings;
create policy "portfolio_settings_delete_own"
on public.portfolio_settings
for delete
to authenticated
using (auth.uid() = id);

--  ----------- Policies de portfolio_editor --------------

drop policy if exists "portfolio_editor_select_own" on public.portfolio_editor;
create policy "portfolio_editor_select_own"
on public.portfolio_editor
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "portfolio_editor_insert_own" on public.portfolio_editor;
create policy "portfolio_editor_insert_own"
on public.portfolio_editor
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "portfolio_editor_update_own" on public.portfolio_editor;
create policy "portfolio_editor_update_own"
on public.portfolio_editor
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "portfolio_editor_delete_own" on public.portfolio_editor;
create policy "portfolio_editor_delete_own"
on public.portfolio_editor
for delete
to authenticated
using (auth.uid() = id);

--  =========== Trigger de Novo Usuário ================
--  ----------- Seed Inicial --------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  fallback_username text;
  fallback_slug text;
begin
  fallback_username := concat('user-', substring(new.id::text from 1 for 8));
  fallback_slug := concat('portfolio-', substring(new.id::text from 1 for 8));

  insert into public.user_accounts (
    id,
    username,
    plan,
    onboarding_status
  )
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'username'), ''), fallback_username),
    'free',
    'not_started'
  );

  insert into public.profiles (
    id,
    public_email
  )
  values (
    new.id,
    coalesce(new.email, '')
  );

  insert into public.professional_data (
    id
  )
  values (
    new.id
  );

  insert into public.portfolio_settings (
    id,
    template_id,
    public_slug,
    publication_status
  )
  values (
    new.id,
    null,
    fallback_slug,
    'draft'
  );

  insert into public.portfolio_editor (
    id,
    template_id,
    device,
    active_section,
    active_project_id
  )
  values (
    new.id,
    null,
    'desktop',
    'hero',
    null
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();