insert into public.app_users (full_name, email, role, department, status, last_activity_at)
values
    ('Sarah Chen', 'sarah.chen@insurai.io', 'underwriter', 'Commercial Risk', 'Active', '2026-04-02T09:30:00Z'::timestamptz),
    ('Marcus Jordan', 'm.jordan@claims.net', 'adjuster', 'Claims', 'Pending MFA', '2026-04-02T07:20:00Z'::timestamptz),
    ('Elena Rodriguez', 'elena.rod@global-inc.com', 'customer', 'Enterprise', 'Active', '2026-04-01T18:45:00Z'::timestamptz),
    ('David Kim', 'dkim_02@temp.com', 'adjuster', 'Temporary Staff', 'Suspended', '2026-03-28T09:12:00Z'::timestamptz),
    ('Priya Nair', 'priya.nair@insurai.io', 'admin', 'Platform Ops', 'Active', '2026-04-02T08:05:00Z'::timestamptz),
    ('Lisa Manager', 'lisa.manager@insurai.io', 'manager', 'Policy Intelligence', 'Active', '2026-04-02T09:05:00Z'::timestamptz),
    ('Sarah Mitchell', 'sarah.mitchell@policyme-demo.com', 'customer', 'Personal Lines', 'Active', '2026-04-02T09:42:00Z'::timestamptz),
    ('Thomas Baxter', 'tbaxter@consultancy.io', 'customer', 'Broker Channel', 'Invited', '2026-03-30T13:10:00Z'::timestamptz)
on conflict (email) do update
set
    full_name = excluded.full_name,
    role = excluded.role,
    department = excluded.department,
    status = excluded.status,
    last_activity_at = excluded.last_activity_at;

create table if not exists public.customer_accounts (
    id uuid primary key default gen_random_uuid(),
    external_key text not null unique,
    app_user_id uuid references public.app_users(id) on delete set null,
    full_name text not null,
    email text not null unique,
    organization text,
    location text,
    claims_history text,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.customer_policies (
    id text primary key,
    customer_account_id uuid not null references public.customer_accounts(id) on delete cascade,
    name text not null,
    type text not null,
    status text not null,
    premium text not null,
    start_date date not null,
    end_date date not null,
    coverage jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.customer_billing_profiles (
    customer_account_id uuid primary key references public.customer_accounts(id) on delete cascade,
    next_payment_amount text not null,
    next_payment_date date not null,
    auto_pay boolean not null default true,
    payment_method jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.customer_billing_history (
    id text primary key,
    customer_account_id uuid not null references public.customer_accounts(id) on delete cascade,
    payment_date date not null,
    amount text not null,
    status text not null,
    reference text not null,
    created_at timestamptz not null default now()
);

create table if not exists public.customer_settings (
    id uuid primary key default gen_random_uuid(),
    customer_account_id uuid not null references public.customer_accounts(id) on delete cascade,
    setting_key text not null,
    icon text not null,
    title text not null,
    description text not null,
    action_label text not null,
    status_label text not null,
    last_updated timestamptz not null default now(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (customer_account_id, setting_key)
);

create table if not exists public.claims (
    id text primary key,
    customer_account_id uuid references public.customer_accounts(id) on delete set null,
    title text not null,
    claim_type text not null,
    icon text not null,
    policy_id text not null,
    policy_holder text not null,
    status text not null,
    incident_date date not null,
    location text not null,
    description text not null,
    estimated_amount text not null,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    highlighted boolean not null default false,
    timeline jsonb not null default '[]'::jsonb,
    analysis jsonb not null default '{}'::jsonb
);

create table if not exists public.claim_evidence_files (
    id uuid primary key default gen_random_uuid(),
    claim_id text not null references public.claims(id) on delete cascade,
    file_name text not null,
    size_bytes bigint not null default 0,
    mime_type text not null,
    storage_bucket text,
    storage_path text,
    created_at timestamptz not null default now()
);

create table if not exists public.applications (
    id text primary key,
    customer_account_id uuid references public.customer_accounts(id) on delete set null,
    applicant_name text not null,
    applicant_email text not null,
    applicant_organization text not null,
    policy_type text not null,
    policy_icon text not null,
    submitted_at date not null,
    status text not null,
    requested_coverage text not null,
    asset_value text not null,
    location text not null,
    claims_history text not null,
    description text not null,
    customer_data jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.underwriting_assessments (
    application_id text primary key references public.applications(id) on delete cascade,
    risk_score integer not null,
    factors jsonb not null default '[]'::jsonb,
    recommend text not null,
    is_mock boolean not null default false,
    generated_at timestamptz not null,
    updated_at timestamptz not null default now()
);

create table if not exists public.graph_documents (
    id text primary key,
    name text not null,
    mime_type text not null,
    size_bytes bigint not null,
    size_label text not null,
    pages integer not null,
    progress integer not null,
    stage text not null,
    nodes_generated integer not null,
    edges_formed integer not null,
    duration_label text not null,
    status text not null,
    uploaded_at timestamptz not null,
    source text not null,
    storage_bucket text,
    storage_path text,
    created_at timestamptz not null default now()
);

create table if not exists public.graph_operations (
    id text primary key,
    type text not null,
    detail text not null,
    status text not null,
    executed_at timestamptz not null,
    created_at timestamptz not null default now()
);

create index if not exists idx_customer_policies_customer_account_id
    on public.customer_policies (customer_account_id);
create index if not exists idx_customer_billing_history_customer_account_id
    on public.customer_billing_history (customer_account_id, payment_date desc);
create index if not exists idx_customer_settings_customer_account_id
    on public.customer_settings (customer_account_id);
create index if not exists idx_claims_status_updated_at
    on public.claims (status, updated_at desc);
create index if not exists idx_claim_evidence_files_claim_id
    on public.claim_evidence_files (claim_id);
create index if not exists idx_applications_status_submitted_at
    on public.applications (status, submitted_at desc);
create index if not exists idx_graph_documents_uploaded_at
    on public.graph_documents (uploaded_at desc);
create index if not exists idx_graph_operations_executed_at
    on public.graph_operations (executed_at desc);

drop trigger if exists trg_customer_accounts_updated_at on public.customer_accounts;
create trigger trg_customer_accounts_updated_at
before update on public.customer_accounts
for each row execute function public.set_updated_at();

drop trigger if exists trg_customer_policies_updated_at on public.customer_policies;
create trigger trg_customer_policies_updated_at
before update on public.customer_policies
for each row execute function public.set_updated_at();

drop trigger if exists trg_customer_billing_profiles_updated_at on public.customer_billing_profiles;
create trigger trg_customer_billing_profiles_updated_at
before update on public.customer_billing_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_customer_settings_updated_at on public.customer_settings;
create trigger trg_customer_settings_updated_at
before update on public.customer_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_applications_updated_at on public.applications;
create trigger trg_applications_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

drop trigger if exists trg_underwriting_assessments_updated_at on public.underwriting_assessments;
create trigger trg_underwriting_assessments_updated_at
before update on public.underwriting_assessments
for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
    ('claim-evidence', 'claim-evidence', false, 52428800, array['application/pdf', 'image/jpeg', 'image/png', 'text/plain']),
    ('policy-documents', 'policy-documents', false, 52428800, array['application/pdf']),
    ('customer-files', 'customer-files', false, 52428800, array['application/pdf', 'image/jpeg', 'image/png', 'text/plain']),
    ('graph-source-docs', 'graph-source-docs', false, 52428800, array['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

with seeded_customers as (
    insert into public.customer_accounts (
        external_key,
        app_user_id,
        full_name,
        email,
        organization,
        location,
        claims_history,
        metadata
    )
    values
        (
            'demo-primary-customer',
            (select id from public.app_users where email = 'sarah.mitchell@policyme-demo.com'),
            'Sarah Mitchell',
            'sarah.mitchell@policyme-demo.com',
            'Mitchell Family Holdings',
            'Bengaluru, Karnataka',
            '1 windshield claim in the last 5 years',
            '{"preferred_policy":"Auto + Home Bundle","household_drivers":2,"property_type":"Single Family Home"}'::jsonb
        ),
        (
            'demo-enterprise-customer',
            (select id from public.app_users where email = 'elena.rod@global-inc.com'),
            'Elena Rodriguez',
            'elena.rod@global-inc.com',
            'Global Incorporated',
            'Pune, Maharashtra',
            'No recent losses',
            '{"account_tier":"Enterprise","open_invoices":0}'::jsonb
        )
    on conflict (email) do update
    set
        external_key = excluded.external_key,
        app_user_id = excluded.app_user_id,
        full_name = excluded.full_name,
        organization = excluded.organization,
        location = excluded.location,
        claims_history = excluded.claims_history,
        metadata = excluded.metadata
    returning id, external_key
)
select 1;

insert into public.customer_policies (
    id,
    customer_account_id,
    name,
    type,
    status,
    premium,
    start_date,
    end_date,
    coverage
)
values
    (
        'POL-AUTO-2026-001',
        (select id from public.customer_accounts where external_key = 'demo-primary-customer'),
        'Comprehensive Auto Insurance',
        'Auto',
        'Active',
        '₹142/mo',
        '2026-01-01',
        '2026-12-31',
        '[
            {"item":"Collision Damage","limit":"₹50,000","deductible":"₹500"},
            {"item":"Comprehensive (Theft, Weather)","limit":"₹50,000","deductible":"₹250"},
            {"item":"Bodily Injury Liability","limit":"₹100,000 per person","deductible":"None"},
            {"item":"Property Damage Liability","limit":"₹50,000","deductible":"None"},
            {"item":"Windshield Replacement","limit":"Full coverage","deductible":"₹0"},
            {"item":"Rental Car Reimbursement","limit":"₹40/day, 30 days max","deductible":"None"}
        ]'::jsonb
    ),
    (
        'POL-PROP-2026-003',
        (select id from public.customer_accounts where external_key = 'demo-primary-customer'),
        'Homeowner''s Insurance',
        'Property',
        'Active',
        '₹210/mo',
        '2026-03-01',
        '2027-02-28',
        '[
            {"item":"Dwelling Coverage","limit":"₹350,000","deductible":"₹1,000"},
            {"item":"Personal Property","limit":"₹175,000","deductible":"₹500"},
            {"item":"Liability Protection","limit":"₹300,000","deductible":"None"},
            {"item":"Water Damage (Non-Flood)","limit":"₹50,000","deductible":"₹1,000"}
        ]'::jsonb
    )
on conflict (id) do update
set
    customer_account_id = excluded.customer_account_id,
    name = excluded.name,
    type = excluded.type,
    status = excluded.status,
    premium = excluded.premium,
    start_date = excluded.start_date,
    end_date = excluded.end_date,
    coverage = excluded.coverage;

insert into public.customer_billing_profiles (
    customer_account_id,
    next_payment_amount,
    next_payment_date,
    auto_pay,
    payment_method
)
values (
    (select id from public.customer_accounts where external_key = 'demo-primary-customer'),
    '₹247.50',
    '2026-04-24',
    true,
    '{"brand":"VISA","last4":"4291","expires":"09/2027","holderName":"Sarah Mitchell"}'::jsonb
)
on conflict (customer_account_id) do update
set
    next_payment_amount = excluded.next_payment_amount,
    next_payment_date = excluded.next_payment_date,
    auto_pay = excluded.auto_pay,
    payment_method = excluded.payment_method;

insert into public.customer_billing_history (
    id,
    customer_account_id,
    payment_date,
    amount,
    status,
    reference
)
values
    ('PAY-20260324', (select id from public.customer_accounts where external_key = 'demo-primary-customer'), '2026-03-24', '₹247.50', 'Paid', 'INV-2026-03'),
    ('PAY-20260224', (select id from public.customer_accounts where external_key = 'demo-primary-customer'), '2026-02-24', '₹247.50', 'Paid', 'INV-2026-02'),
    ('PAY-20260124', (select id from public.customer_accounts where external_key = 'demo-primary-customer'), '2026-01-24', '₹247.50', 'Paid', 'INV-2026-01')
on conflict (id) do update
set
    customer_account_id = excluded.customer_account_id,
    payment_date = excluded.payment_date,
    amount = excluded.amount,
    status = excluded.status,
    reference = excluded.reference;

insert into public.customer_settings (
    customer_account_id,
    setting_key,
    icon,
    title,
    description,
    action_label,
    status_label,
    last_updated
)
values
    ((select id from public.customer_accounts where external_key = 'demo-primary-customer'), 'password', 'lock', 'Password', 'Reset and rotate your account password.', 'Update', 'Last changed 45 days ago', '2026-02-15T09:00:00Z'::timestamptz),
    ((select id from public.customer_accounts where external_key = 'demo-primary-customer'), 'twofa', 'security', 'Two-Factor Authentication', 'Authenticator app challenge is required at sign-in.', 'Manage', 'Enabled', '2026-01-12T11:30:00Z'::timestamptz),
    ((select id from public.customer_accounts where external_key = 'demo-primary-customer'), 'notifications', 'notifications', 'Notifications', 'Delivery channels for billing, claims, and account alerts.', 'Configure', 'Email + SMS', '2026-03-20T08:15:00Z'::timestamptz),
    ((select id from public.customer_accounts where external_key = 'demo-primary-customer'), 'privacy', 'visibility', 'Privacy', 'Sharing controls for account activity and claim updates.', 'Review', 'Standard', '2026-03-01T15:45:00Z'::timestamptz)
on conflict (customer_account_id, setting_key) do update
set
    icon = excluded.icon,
    title = excluded.title,
    description = excluded.description,
    action_label = excluded.action_label,
    status_label = excluded.status_label,
    last_updated = excluded.last_updated;

insert into public.claims (
    id,
    customer_account_id,
    title,
    claim_type,
    icon,
    policy_id,
    policy_holder,
    status,
    incident_date,
    location,
    description,
    estimated_amount,
    created_at,
    updated_at,
    highlighted,
    timeline,
    analysis
)
values
    (
        'CL-90122',
        (select id from public.customer_accounts where external_key = 'demo-primary-customer'),
        'Windshield Damage',
        'auto-comprehensive',
        'directions_car',
        'AU-82910-XM',
        'Sarah Mitchell',
        'Under Review',
        '2023-10-14',
        'Bengaluru, Karnataka',
        'A highway rock struck the front windshield during evening traffic and created a full-width crack that requires replacement.',
        '₹1,250',
        '2023-10-14T09:42:00Z'::timestamptz,
        '2023-10-14T13:20:00Z'::timestamptz,
        false,
        '[
            {"label":"Claim Submitted","detail":"Customer uploaded windshield photos and incident summary.","timestamp":"2023-10-14T09:42:00.000Z"},
            {"label":"Quote Verification","detail":"Safelite estimate is under review by the adjuster team.","timestamp":"2023-10-14T13:20:00.000Z"}
        ]'::jsonb,
        '{
            "recommendation":"approve",
            "payoutEstimate":"₹1,688",
            "reasoning":[
                "The reported loss pattern matches standard covered auto damage.",
                "Estimated severity is within expected payout bands for similar claims.",
                "No fraud or exclusion flags were triggered from the structured intake fields."
            ],
            "policyMatches":[
                {"clauseId":"3C","title":"Collision And Glass Coverage","excerpt":"Physical damage to insured vehicles, including windshield and body damage, is covered after the applicable deductible.","confidence":0.97},
                {"clauseId":"9F","title":"Wear And Tear Exclusion","excerpt":"Progressive deterioration and pre-existing damage are excluded from payout calculations.","confidence":0.82}
            ]
        }'::jsonb
    ),
    (
        'CL-88401',
        null,
        'Rear-end Collision',
        'auto-collision',
        'directions_car',
        'AU-55081-QN',
        'James Harrison',
        'Approved',
        '2023-08-03',
        'Pune, Maharashtra',
        'Vehicle sustained rear bumper and trunk damage after being struck at a stoplight.',
        '₹4,250',
        '2023-08-03T16:10:00Z'::timestamptz,
        '2023-08-05T11:00:00Z'::timestamptz,
        false,
        '[
            {"label":"Claim Submitted","detail":"Police report and repair estimate received.","timestamp":"2023-08-03T16:10:00.000Z"},
            {"label":"Approved For Payout","detail":"Repair reimbursement was approved after liability validation.","timestamp":"2023-08-05T11:00:00.000Z"}
        ]'::jsonb,
        '{
            "recommendation":"approve",
            "payoutEstimate":"₹5,738",
            "reasoning":[
                "The reported loss pattern matches standard covered auto damage.",
                "Estimated severity is within expected payout bands for similar claims.",
                "No fraud or exclusion flags were triggered from the structured intake fields."
            ],
            "policyMatches":[
                {"clauseId":"3C","title":"Collision And Glass Coverage","excerpt":"Physical damage to insured vehicles, including windshield and body damage, is covered after the applicable deductible.","confidence":0.97},
                {"clauseId":"9F","title":"Wear And Tear Exclusion","excerpt":"Progressive deterioration and pre-existing damage are excluded from payout calculations.","confidence":0.82}
            ]
        }'::jsonb
    ),
    (
        'CL-77219',
        null,
        'Residential Water Damage',
        'property',
        'home',
        'HM-44012-BY',
        'Aria Khel',
        'Urgent',
        '2023-03-18',
        'Hyderabad, Telangana',
        'A burst supply line flooded the kitchen and adjacent hallway, damaging cabinetry and flooring.',
        '₹8,900',
        '2023-03-18T07:25:00Z'::timestamptz,
        '2023-03-18T08:00:00Z'::timestamptz,
        true,
        '[
            {"label":"Emergency Intake","detail":"Property claim routed to priority review.","timestamp":"2023-03-18T07:25:00.000Z"},
            {"label":"Priority Escalation","detail":"Potential secondary water ingress flagged for same-day review.","timestamp":"2023-03-18T08:00:00.000Z"}
        ]'::jsonb,
        '{
            "recommendation":"approve",
            "payoutEstimate":"₹12,015",
            "reasoning":[
                "Water mitigation response occurred quickly, reducing secondary loss exposure.",
                "Damage profile is consistent with a covered sudden and accidental discharge event.",
                "Claim size warrants urgent handling but does not indicate exclusionary loss causes."
            ],
            "policyMatches":[
                {"clauseId":"7A","title":"Sudden Water Discharge","excerpt":"Direct physical loss caused by sudden and accidental discharge of water is covered subject to deductible and mitigation duties.","confidence":0.95},
                {"clauseId":"11D","title":"Flood Exclusion","excerpt":"Flood and surface water losses are excluded unless expressly endorsed.","confidence":0.77}
            ]
        }'::jsonb
    )
on conflict (id) do update
set
    customer_account_id = excluded.customer_account_id,
    title = excluded.title,
    claim_type = excluded.claim_type,
    icon = excluded.icon,
    policy_id = excluded.policy_id,
    policy_holder = excluded.policy_holder,
    status = excluded.status,
    incident_date = excluded.incident_date,
    location = excluded.location,
    description = excluded.description,
    estimated_amount = excluded.estimated_amount,
    created_at = excluded.created_at,
    updated_at = excluded.updated_at,
    highlighted = excluded.highlighted,
    timeline = excluded.timeline,
    analysis = excluded.analysis;

insert into public.claim_evidence_files (
    claim_id,
    file_name,
    size_bytes,
    mime_type
)
values
    ('CL-90122', 'windshield_photo.jpg', 1240000, 'image/jpeg'),
    ('CL-88401', 'collision_report.pdf', 220000, 'application/pdf'),
    ('CL-88401', 'rear_bumper.jpg', 980000, 'image/jpeg'),
    ('CL-77219', 'kitchen_overview.jpg', 1320000, 'image/jpeg'),
    ('CL-77219', 'mitigation_invoice.pdf', 410000, 'application/pdf')
on conflict do nothing;

insert into public.applications (
    id,
    applicant_name,
    applicant_email,
    applicant_organization,
    policy_type,
    policy_icon,
    submitted_at,
    status,
    requested_coverage,
    asset_value,
    location,
    claims_history,
    description,
    customer_data
)
values
    (
        'APP-94281',
        'Sarah Mitchell',
        'sm.design@email.com',
        'Sterling Real Estate Holdings',
        'Commercial Property',
        'home',
        '2023-10-24',
        'Under Review',
        '₹2,500,000',
        '₹14.2M',
        '42 MG Road, Bengaluru, Karnataka',
        '1 low-severity property claim in 8 years',
        'Mixed-use commercial plaza with upgraded fire suppression and strong tenant credit profile.',
        '{"applicant_name":"Sterling Real Estate Holdings","policy_type":"Commercial Property","requested_coverage":2500000,"asset_value":14200000,"occupancy_rate":94,"years_in_portfolio":8,"claims_last_5_years":1,"flood_zone":"secondary","fire_suppression_upgrade":true,"location":"Bengaluru, Karnataka"}'::jsonb
    ),
    (
        'APP-93102',
        'James Harrison',
        'j.harrison@corp.net',
        'Northline Fleet Services',
        'Commercial Auto',
        'directions_car',
        '2023-10-23',
        'Pending Review',
        '₹750,000',
        '₹480,000',
        'Pune, Maharashtra',
        '3 collision losses in 24 months',
        'Fleet coverage request for executive and courier vehicles operating across the Pune Metro region.',
        '{"applicant_name":"Northline Fleet Services","policy_type":"Commercial Auto","requested_coverage":750000,"fleet_size":12,"garaging_location":"Pune, Maharashtra","claims_last_24_months":3,"telematics_enabled":false,"driver_training_program":false}'::jsonb
    ),
    (
        'APP-92884',
        'Aria Khel',
        'aria.k@cloud.com',
        'Oakwood Residence Trust',
        'Residential Premium',
        'shield',
        '2023-10-23',
        'Under Review',
        '₹900,000',
        '₹1.1M',
        'Bengaluru, Karnataka',
        'No prior losses',
        'Primary residence with recent roof replacement and monitored security system.',
        '{"applicant_name":"Aria Khel","policy_type":"Residential Premium","requested_coverage":900000,"property_value":1100000,"roof_replaced_in_last_5_years":true,"monitored_security_system":true,"claims_last_5_years":0,"location":"Bengaluru, Karnataka"}'::jsonb
    ),
    (
        'APP-91203',
        'Thomas Baxter',
        'tbaxter@consultancy.io',
        'Harbor Medical',
        'Health Comprehensive',
        'favorite',
        '2023-10-22',
        'Pending Review',
        '₹1,200,000',
        '₹3.6M',
        'Chennai, Tamil Nadu',
        'Open malpractice dispute and 2 prior high-cost claims',
        'Multi-site clinic network requesting expanded health and liability coverage.',
        '{"applicant_name":"Harbor Medical","policy_type":"Health Comprehensive","requested_coverage":1200000,"annual_revenue":6200000,"open_litigation":true,"claims_last_36_months":2,"high_cost_claims":true,"location":"Chennai, Tamil Nadu"}'::jsonb
    )
on conflict (id) do update
set
    applicant_name = excluded.applicant_name,
    applicant_email = excluded.applicant_email,
    applicant_organization = excluded.applicant_organization,
    policy_type = excluded.policy_type,
    policy_icon = excluded.policy_icon,
    submitted_at = excluded.submitted_at,
    status = excluded.status,
    requested_coverage = excluded.requested_coverage,
    asset_value = excluded.asset_value,
    location = excluded.location,
    claims_history = excluded.claims_history,
    description = excluded.description,
    customer_data = excluded.customer_data;

insert into public.underwriting_assessments (
    application_id,
    risk_score,
    factors,
    recommend,
    is_mock,
    generated_at
)
values
    ('APP-94281', 85, '["Modernized fire suppression lowers fire-related exposure.","Secondary flood zone requires structural review.","Strong tenant credit mix improves revenue stability."]'::jsonb, 'approve', true, '2023-10-24T14:00:00Z'::timestamptz),
    ('APP-93102', 45, '["Claims frequency is elevated for the fleet size.","No telematics or formal driver training controls were declared.","Urban operating footprint increases collision exposure."]'::jsonb, 'reject', true, '2023-10-23T11:30:00Z'::timestamptz),
    ('APP-92884', 94, '["Recent roof replacement reduces near-term structural exposure.","No prior losses reported in the last five years.","Monitored security system lowers theft risk."]'::jsonb, 'approve', true, '2023-10-23T10:15:00Z'::timestamptz),
    ('APP-91203', 28, '["Open litigation materially increases underwriting uncertainty.","Recent high-cost claims create adverse loss history.","Expanded coverage request is not matched by stronger controls."]'::jsonb, 'reject', true, '2023-10-22T09:05:00Z'::timestamptz)
on conflict (application_id) do update
set
    risk_score = excluded.risk_score,
    factors = excluded.factors,
    recommend = excluded.recommend,
    is_mock = excluded.is_mock,
    generated_at = excluded.generated_at;

insert into public.graph_documents (
    id,
    name,
    mime_type,
    size_bytes,
    size_label,
    pages,
    progress,
    stage,
    nodes_generated,
    edges_formed,
    duration_label,
    status,
    uploaded_at,
    source
)
values
    ('DOC-1001', 'Auto_Insurance_Policy_IN.pdf', 'application/pdf', 8400000, '8.4 MB', 142, 100, 'Committed to Neo4j semantic layer', 1402, 12841, '02m 41s', 'Committed', '2026-04-02T07:10:00Z'::timestamptz, 'demo'),
    ('DOC-1002', 'Commercial_Liability_Q3.pdf', 'application/pdf', 6900000, '6.9 MB', 118, 84, 'Vectorizing chunks (241/280)', 982, 9140, '01m 54s', 'Processing', '2026-04-02T08:12:00Z'::timestamptz, 'demo'),
    ('DOC-1003', 'Homeowner_HO3_Rider.pdf', 'application/pdf', 3300000, '3.3 MB', 64, 42, 'Identifying entities and relationships', 421, 2874, '00m 49s', 'Processing', '2026-04-02T08:45:00Z'::timestamptz, 'demo'),
    ('DOC-1004', 'State_Regulations_KA_2024.pdf', 'application/pdf', 5100000, '5.1 MB', 86, 5, 'Waiting for OCR pipeline', 0, 0, 'Queued', 'Processing', '2026-04-02T09:05:00Z'::timestamptz, 'demo')
on conflict (id) do update
set
    name = excluded.name,
    mime_type = excluded.mime_type,
    size_bytes = excluded.size_bytes,
    size_label = excluded.size_label,
    pages = excluded.pages,
    progress = excluded.progress,
    stage = excluded.stage,
    nodes_generated = excluded.nodes_generated,
    edges_formed = excluded.edges_formed,
    duration_label = excluded.duration_label,
    status = excluded.status,
    uploaded_at = excluded.uploaded_at,
    source = excluded.source;

insert into public.graph_operations (
    id,
    type,
    detail,
    status,
    executed_at
)
values
    ('GRAPH-OP-1001', 'reindex', 'Node reindex completed and cache warmed.', 'Completed', '2026-04-02T06:45:00Z'::timestamptz),
    ('GRAPH-OP-1002', 'refresh_vectors', 'Global vector refresh completed across active clusters.', 'Completed', '2026-04-02T06:58:00Z'::timestamptz),
    ('GRAPH-OP-1003', 'refresh_vectors', 'Global vector refresh completed across active clusters.', 'Completed', '2026-04-01T21:18:00Z'::timestamptz)
on conflict (id) do update
set
    type = excluded.type,
    detail = excluded.detail,
    status = excluded.status,
    executed_at = excluded.executed_at;
