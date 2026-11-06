create table public.technocrat_subs (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  subscribed_at timestamptz not null default now(),
  constraint techno_subs_email_key unique (email),
  constraint techno_subs_email_lowercase_check check (email = lower(email)),
  constraint techno_subs_email_length_check check (char_length(email) between 3 and 320)
);

comment on table public.technocrat_subs is
  'Newsletter subscriptions submitted through the server-side application action.';
  
alter table public.technocrat_subs enable row level security;

revoke all on table public.technocrat_subs from public, anon, authenticated;
grant insert on table public.technocrat_subs to service_role;