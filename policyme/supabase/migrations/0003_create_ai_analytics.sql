create table if not exists public.ai_performance_metrics (
    id uuid primary key default gen_random_uuid(),
    metric_date date not null unique,
    avg_match_confidence numeric not null,
    hitl_rate numeric not null,
    retrieval_speed_ms integer not null,
    created_at timestamptz not null default now()
);

create table if not exists public.ai_hallucination_risks (
    id uuid primary key default gen_random_uuid(),
    query_signature text not null,
    document_reference text not null,
    model_version text not null,
    confidence_score numeric not null,
    action_taken text not null,
    flagged_at timestamptz not null default now()
);

create table if not exists public.ai_model_training_status (
    id uuid primary key default gen_random_uuid(),
    model_name text not null unique,
    current_epoch integer not null,
    total_epochs integer not null,
    loss numeric not null,
    progress_percent integer not null,
    updated_at timestamptz not null default now()
);

-- Note: we use 'metric_date' to record the date for the time series graph.

-- Seed performance metrics (e.g. last 5 points matching the visual graph)
insert into public.ai_performance_metrics (metric_date, avg_match_confidence, hitl_rate, retrieval_speed_ms)
values
    (current_date - interval '4 days', 80.0, 15.2, 260),
    (current_date - interval '3 days', 85.5, 14.1, 255),
    (current_date - interval '2 days', 50.0, 18.0, 265),
    (current_date - interval '1 days', 90.0, 13.5, 245),
    (current_date, 94.2, 12.8, 240)
on conflict (metric_date) do update set
    avg_match_confidence = excluded.avg_match_confidence,
    hitl_rate = excluded.hitl_rate,
    retrieval_speed_ms = excluded.retrieval_speed_ms;

-- Seed hallucination risks
insert into public.ai_hallucination_risks (query_signature, document_reference, model_version, confidence_score, action_taken)
values
    ('Water damage limits on policy HX-819', 'Homeowner_Comprehensive_v2.pdf', 'Gemini-Pro-2.0', 42.0, 'FLAGGED HITL'),
    ('Does commercial auto cover employee negligence?', 'Commercial_Auto_Rideshare_Rider.pdf', 'Claude-3-Sonnet', 68.0, 'RAG RETRIED')
on conflict do nothing;

-- Seed model training status
insert into public.ai_model_training_status (model_name, current_epoch, total_epochs, loss, progress_percent)
values
    ('Policy_Embedding_v4', 42, 100, 0.124, 42)
on conflict (model_name) do update set
    current_epoch = excluded.current_epoch,
    total_epochs = excluded.total_epochs,
    loss = excluded.loss,
    progress_percent = excluded.progress_percent,
    updated_at = now();
