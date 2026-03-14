drop policy if exists "portfolio_settings_select_public_published" on public.portfolio_settings;
create policy "portfolio_settings_select_public_published"
on public.portfolio_settings
for select
to anon, authenticated
using (
  publication_status = 'published'
  and template_id is not null
  and nullif(btrim(public_slug), '') is not null
);

drop policy if exists "profiles_select_public_published" on public.profiles;
create policy "profiles_select_public_published"
on public.profiles
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.portfolio_settings as settings
    where settings.id = profiles.id
      and settings.publication_status = 'published'
      and settings.template_id is not null
      and nullif(btrim(settings.public_slug), '') is not null
  )
);

drop policy if exists "professional_data_select_public_published" on public.professional_data;
create policy "professional_data_select_public_published"
on public.professional_data
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.portfolio_settings as settings
    where settings.id = professional_data.id
      and settings.publication_status = 'published'
      and settings.template_id is not null
      and nullif(btrim(settings.public_slug), '') is not null
  )
);

drop policy if exists "portfolio_editor_select_public_published" on public.portfolio_editor;
create policy "portfolio_editor_select_public_published"
on public.portfolio_editor
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.portfolio_settings as settings
    where settings.id = portfolio_editor.id
      and settings.publication_status = 'published'
      and settings.template_id is not null
      and nullif(btrim(settings.public_slug), '') is not null
  )
);
