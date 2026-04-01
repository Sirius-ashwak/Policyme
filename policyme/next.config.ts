import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/dashboard/admin/audit-logs", destination: "/dashboard/admin/logs", permanent: false },
      { source: "/dashboard/admin/system-monitoring-health", destination: "/dashboard/admin/monitoring", permanent: false },
      { source: "/dashboard/admin/user-role-management", destination: "/dashboard/admin/users", permanent: false },
      { source: "/dashboard/admin/knowledge-graph-operations", destination: "/dashboard/admin/graph", permanent: false },
      { source: "/dashboard/admin/ai-performance-analytics", destination: "/dashboard/admin/analytics", permanent: false },
      { source: "/dashboard/underwriter/queue", destination: "/dashboard/underwriter", permanent: false },
      { source: "/dashboard/underwriter/ai-risk-assessor", destination: "/dashboard/underwriter/assessments", permanent: false },
      { source: "/dashboard/adjuster/claims-queue", destination: "/dashboard/adjuster", permanent: false },
      { source: "/dashboard/adjuster/ai-claim-analysis", destination: "/dashboard/adjuster/ask", permanent: false },
      { source: "/portal/new-application", destination: "/portal/apply", permanent: false },
      { source: "/portal/submit-a-claim", destination: "/portal/submit", permanent: false },
    ];
  },
};

export default nextConfig;
