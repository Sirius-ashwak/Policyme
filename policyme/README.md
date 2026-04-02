## PolicyMe Frontend

Next.js application for the PolicyMe insurance platform.

## Prerequisites

- Node.js 20+
- npm 10+
- Running backend services:
	- Java ingestion API (default: `http://localhost:8081`)
	- Python GraphRAG API (default: `http://localhost:8000`)

## Environment Variables

Create a `.env.local` file with the variables you use in your environment.

Required for Supabase-backed admin users API:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

Optional service URLs (defaults shown):

```bash
INGESTION_API_URL=http://localhost:8081
GRAPHRAG_API_URL=http://localhost:8000
```

Authentication variables (if using OAuth providers):

```bash
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Supabase Setup (Admin Users)

Run the SQL migration in your Supabase SQL editor:

- `supabase/migrations/0001_create_app_users.sql`

This creates `public.app_users`, an update trigger, an activity index, and sample seed users.

The admin users API route now reads from Supabase:

- `GET /api/admin/users`
- Optional query parameter: `limit` (default `100`, max `500`)

## Install And Run

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.
