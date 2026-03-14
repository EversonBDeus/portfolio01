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
  fallback_username := concat(
    'user-',
    substring(md5(new.id::text || coalesce(new.email, '') || clock_timestamp()::text || random()::text) from 1 for 8)
  );

  fallback_slug := concat(
    'portfolio-',
    substring(md5(new.id::text || coalesce(new.email, '') || clock_timestamp()::text || random()::text) from 1 for 10)
  );

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

update public.portfolio_settings
set public_slug = concat(
  'portfolio-',
  substring(md5(id::text || clock_timestamp()::text || random()::text) from 1 for 10)
)
where public_slug ~ '^portfolio-[0-9a-f]{8}$'
  and publication_status = 'draft';
