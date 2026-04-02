create extension if not exists "pgcrypto";

create table if not exists public.app_users (
    id uuid primary key default gen_random_uuid(),
    full_name text,
    email text not null unique,
    role text,
    department text,
    status text not null default 'Active',
    last_activity_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_app_users_last_activity_at
    on public.app_users (last_activity_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_app_users_updated_at on public.app_users;
create trigger trg_app_users_updated_at
before update on public.app_users
for each row execute function public.set_updated_at();

insert into public.app_users (full_name, email, role, department, status, last_activity_at)
values
    ('Sarah Chen', 'sarah.chen@insurai.io', 'underwriter', 'Underwriting', 'Active', now()),
    ('Marcus Jordan', 'm.jordan@claims.net', 'adjuster', 'Claims', 'Pending MFA', now() - interval '2 hours'),
    ('Elena Rodriguez', 'elena.rod@global-inc.com', 'customer', 'Commercial', 'Active', now() - interval '1 day')
on conflict (email) do nothing;
