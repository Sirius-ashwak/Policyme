-- Localize seeded demo records from USD/US defaults to INR/India.

update public.customer_accounts
set location = case
    when external_key = 'demo-primary-customer' then 'Bengaluru, Karnataka'
    when external_key = 'demo-enterprise-customer' then 'Pune, Maharashtra'
    else location
end
where external_key in ('demo-primary-customer', 'demo-enterprise-customer');

update public.customer_policies
set
    premium = '₹142/mo',
    coverage = '[
        {"item":"Collision Damage","limit":"₹50,000","deductible":"₹500"},
        {"item":"Comprehensive (Theft, Weather)","limit":"₹50,000","deductible":"₹250"},
        {"item":"Bodily Injury Liability","limit":"₹100,000 per person","deductible":"None"},
        {"item":"Property Damage Liability","limit":"₹50,000","deductible":"None"},
        {"item":"Windshield Replacement","limit":"Full coverage","deductible":"₹0"},
        {"item":"Rental Car Reimbursement","limit":"₹40/day, 30 days max","deductible":"None"}
    ]'::jsonb
where id = 'POL-AUTO-2026-001';

update public.customer_policies
set
    premium = '₹210/mo',
    coverage = '[
        {"item":"Dwelling Coverage","limit":"₹350,000","deductible":"₹1,000"},
        {"item":"Personal Property","limit":"₹175,000","deductible":"₹500"},
        {"item":"Liability Protection","limit":"₹300,000","deductible":"None"},
        {"item":"Water Damage (Non-Flood)","limit":"₹50,000","deductible":"₹1,000"}
    ]'::jsonb
where id = 'POL-PROP-2026-003';

update public.customer_billing_profiles
set next_payment_amount = '₹247.50'
where customer_account_id = (
    select id
    from public.customer_accounts
    where external_key = 'demo-primary-customer'
    limit 1
);

update public.customer_billing_history
set amount = '₹247.50'
where id in ('PAY-20260324', 'PAY-20260224', 'PAY-20260124');

update public.claims
set
    location = 'Bengaluru, Karnataka',
    estimated_amount = '₹1,250',
    analysis = jsonb_set(coalesce(analysis, '{}'::jsonb), '{payoutEstimate}', to_jsonb('₹1,688'::text), true)
where id = 'CL-90122';

update public.claims
set
    location = 'Pune, Maharashtra',
    estimated_amount = '₹4,250',
    analysis = jsonb_set(coalesce(analysis, '{}'::jsonb), '{payoutEstimate}', to_jsonb('₹5,738'::text), true)
where id = 'CL-88401';

update public.claims
set
    location = 'Hyderabad, Telangana',
    estimated_amount = '₹8,900',
    analysis = jsonb_set(coalesce(analysis, '{}'::jsonb), '{payoutEstimate}', to_jsonb('₹12,015'::text), true)
where id = 'CL-77219';

update public.applications
set
    requested_coverage = '₹2,500,000',
    asset_value = '₹14.2M',
    location = '42 MG Road, Bengaluru, Karnataka',
    customer_data = jsonb_set(coalesce(customer_data, '{}'::jsonb), '{location}', to_jsonb('Bengaluru, Karnataka'::text), true)
where id = 'APP-94281';

update public.applications
set
    requested_coverage = '₹750,000',
    asset_value = '₹480,000',
    location = 'Pune, Maharashtra',
    description = 'Fleet coverage request for executive and courier vehicles operating across the Pune Metro region.',
    customer_data = jsonb_set(coalesce(customer_data, '{}'::jsonb), '{garaging_location}', to_jsonb('Pune, Maharashtra'::text), true)
where id = 'APP-93102';

update public.applications
set
    requested_coverage = '₹900,000',
    asset_value = '₹1.1M',
    location = 'Bengaluru, Karnataka',
    customer_data = jsonb_set(coalesce(customer_data, '{}'::jsonb), '{location}', to_jsonb('Bengaluru, Karnataka'::text), true)
where id = 'APP-92884';

update public.applications
set
    requested_coverage = '₹1,200,000',
    asset_value = '₹3.6M',
    location = 'Chennai, Tamil Nadu',
    customer_data = jsonb_set(coalesce(customer_data, '{}'::jsonb), '{location}', to_jsonb('Chennai, Tamil Nadu'::text), true)
where id = 'APP-91203';

update public.graph_documents
set name = case
    when id = 'DOC-1001' then 'Auto_Insurance_Policy_IN.pdf'
    when id = 'DOC-1004' then 'State_Regulations_KA_2024.pdf'
    else name
end
where id in ('DOC-1001', 'DOC-1004');
