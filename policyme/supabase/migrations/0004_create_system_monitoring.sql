create table if not exists public.system_telemetry (
    id uuid primary key default gen_random_uuid(),
    metric_date timestamptz not null unique,
    api_latency_ms integer not null,
    latency_trend_pct numeric not null,
    token_throughput_k numeric not null,
    throughput_trend_pct numeric not null,
    cpu_load_pct integer not null,
    memory_usage_pct integer not null,
    storage_io_pct integer not null,
    created_at timestamptz not null default now()
);

create table if not exists public.graph_telemetry (
    id uuid primary key default gen_random_uuid(),
    metric_date timestamptz not null unique,
    node_count_m numeric not null,
    relationship_count_m numeric not null,
    query_speed_ms integer not null,
    cache_hit_ratio_pct integer not null,
    created_at timestamptz not null default now()
);

create table if not exists public.infrastructure_logs (
    id uuid primary key default gen_random_uuid(),
    log_id text not null unique,
    component text not null,
    event text not null,
    status text not null,
    category text not null, -- 'SYSTEM', 'GRAPH', 'NETWORK' etc.
    logged_at timestamptz not null default now()
);

-- Seed System Telemetry with 1 record simulating the "current" state
insert into public.system_telemetry (metric_date, api_latency_ms, latency_trend_pct, token_throughput_k, throughput_trend_pct, cpu_load_pct, memory_usage_pct, storage_io_pct)
values
    (now(), 124, -12.0, 842.5, 4.2, 64, 42, 18)
on conflict (metric_date) do nothing;

-- Seed Graph Telemetry
insert into public.graph_telemetry (metric_date, node_count_m, relationship_count_m, query_speed_ms, cache_hit_ratio_pct)
values
    (now(), 4.2, 18.7, 8, 94)
on conflict (metric_date) do nothing;

-- Seed Infrastructure Logs (mix of old and recent timestamps)
insert into public.infrastructure_logs (log_id, component, event, status, category, logged_at)
values
    ('LOG-1025', 'LLM-Cluster-02', 'Model quantization swap completed successfully.', 'SUCCESS', 'SYSTEM', now() - interval '2 minutes'),
    ('LOG-1024', 'Neo4j-Primary', 'Memory pressure detected on index "Policy_Vector".', 'WARNING', 'GRAPH', now() - interval '10 minutes'),
    ('LOG-1023', 'API-Gateway-US', 'High latency detected in US-East region (240ms).', 'CRITICAL', 'SYSTEM', now() - interval '1 hour'),
    ('LOG-1022', 'Neo4j-Read-Replica', 'Sync lag exceeded 500ms.', 'WARNING', 'GRAPH', now() - interval '2 hours'),
    ('LOG-1021', 'Auth-Service', 'Spike in invalid MFA attempts.', 'WARNING', 'SYSTEM', now() - interval '1 day'),
    ('LOG-1020', 'Storage-Bucket', 'Archival process completed 1.2TB.', 'SUCCESS', 'SYSTEM', now() - interval '2 days')
on conflict (log_id) do nothing;
