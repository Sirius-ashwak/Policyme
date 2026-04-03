"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type OverviewData = {
    telemetry: {
        neo4j_status_pct: number;
        api_latency_ms: number;
        llm_tokens_k: number;
    };
    users: {
        customers: number;
        underwriters: number;
        adjusters: number;
    };
    auditLogs: Array<{
        action: string;
        actor_name: string;
        timestamp: string;
        actor_badge: string;
        outcome: string;
    }>;
};

export default function AdminDashboardPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<"live" | "historical">("live");
    const [data, setData] = useState<OverviewData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchOverview = async () => {
            try {
                const res = await fetch("/api/admin/overview");
                if (!res.ok) throw new Error("Failed to load overview data");
                const json = await res.json();
                if (mounted) {
                    setData(json);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Overview load error:", err);
                if (mounted) setIsLoading(false);
            }
        };

        fetchOverview();
        const interval = setInterval(fetchOverview, 30000); // 30s refresh for live feel
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    const formatTimeAgo = (ts: string) => {
        if (!ts) return "Recently";
        const diff = Date.now() - new Date(ts).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    return (
        <div className="flex-1 w-full bg-[var(--insurai-surface)] font-['Manrope'] selection:bg-[var(--primary)]/20 px-6 md:px-10 py-12 relative">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--insurai-on-surface)] mb-2 font-['Manrope']">
                        System Overview
                    </h1>
                    <p className="text-[var(--insurai-on-surface-variant)] leading-relaxed">
                        Enterprise intelligence engine monitoring. All semantic layers operational across distributed clusters.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-[var(--insurai-surface-container-low)] p-1.5 rounded-xl">
                    <button 
                        onClick={() => setViewMode("live")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-['Inter'] transition-all ${
                            viewMode === "live" 
                                ? "bg-[var(--insurai-surface-container-lowest)] shadow-[0_2px_4px_rgba(0,0,0,0.02)] font-semibold text-[var(--primary)]" 
                                : "font-medium text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)]"
                        }`}
                    >
                        LIVE
                    </button>
                    <button 
                        onClick={() => setViewMode("historical")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-['Inter'] transition-all ${
                            viewMode === "historical" 
                                ? "bg-[var(--insurai-surface-container-lowest)] shadow-[0_2px_4px_rgba(0,0,0,0.02)] font-semibold text-[var(--primary)]" 
                                : "font-medium text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)]"
                        }`}
                    >
                        HISTORICAL
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                <section className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)] transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <span className="material-symbols-outlined text-[var(--primary)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                hub
                            </span>
                            <span className="text-[10px] font-['Inter'] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm flex items-center gap-1">
                                {isLoading ? <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> : null}
                                Healthy
                            </span>
                        </div>
                        <p className="text-[var(--insurai-on-surface-variant)] text-xs font-['Inter'] uppercase tracking-widest mb-1">
                            Neo4j Status
                        </p>
                        <h3 className="text-2xl font-bold font-['Manrope']">
                            {isLoading ? "..." : data?.telemetry?.neo4j_status_pct || "99.98"}<span className="text-sm font-normal text-[var(--insurai-on-surface-variant)] ml-1">%</span>
                        </h3>
                        <div className="mt-4 h-1 w-full bg-[var(--insurai-surface-container-low)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--primary)] w-[99.98%] transition-all duration-1000"></div>
                        </div>
                    </div>

                    <div className="col-span-1 bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="material-symbols-outlined text-[var(--primary)]">timer</span>
                            <span className="text-[10px] font-['Inter'] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                Nominal
                            </span>
                        </div>
                        <p className="text-[var(--insurai-on-surface-variant)] text-xs font-['Inter'] uppercase tracking-widest mb-1">
                            API Latency
                        </p>
                        <h3 className="text-2xl font-bold font-['Manrope']">
                            {isLoading ? "..." : data?.telemetry?.api_latency_ms || "124"}<span className="text-sm font-normal text-[var(--insurai-on-surface-variant)] ml-1">ms</span>
                        </h3>
                        <div className="mt-4 flex gap-[2px] items-end h-6 opacity-80">
                            {Array.from({length: 6}).map((_, i) => (
                                <div key={i} className="w-1 bg-[var(--primary)] h-full rounded-full transition-all duration-500" 
                                    style={{ height: `${Math.max(20, Math.random() * 100)}%`, opacity: (i+1)*0.15 }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="material-symbols-outlined text-[var(--primary)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                generating_tokens
                            </span>
                            <span className="text-[10px] font-['Inter'] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                Active
                            </span>
                        </div>
                        <p className="text-[var(--insurai-on-surface-variant)] text-xs font-['Inter'] uppercase tracking-widest mb-1">
                            LLM Tokens
                        </p>
                        <h3 className="text-2xl font-bold font-['Manrope']">
                            {isLoading ? "..." : ((data?.telemetry?.llm_tokens_k || 1200) / 1000).toFixed(1)}M<span className="text-sm font-normal text-[var(--insurai-on-surface-variant)] ml-1">/hr</span>
                        </h3>
                        <div className="mt-4 h-1 w-full bg-[var(--insurai-surface-container-low)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--primary)] w-[65%]"></div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-3 bg-[var(--insurai-surface-container-lowest)] p-8 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                                <div>
                                    <p className="text-xs font-['Inter'] uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-1">
                                        AI Performance Trend
                                    </p>
                                    <h2 className="text-3xl font-extrabold font-['Manrope']">Precision Metrics</h2>
                                </div>
                                <div className="flex gap-8">
                                    <div className="text-right">
                                        <p className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-tighter">Avg Match Confidence</p>
                                        <p className="text-xl font-bold text-[var(--primary)]">98.4%</p>
                                    </div>
                                    <div className="text-right border-l border-[var(--insurai-outline-variant)]/30 pl-8">
                                        <p className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-tighter">Human Override Rate</p>
                                        <p className="text-xl font-bold text-[var(--insurai-on-surface)]">1.2%</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="h-48 w-full flex items-end gap-2">
                                {[40, 55, 48, 72, 68, 85, 78].map((val, i) => (
                                    <div key={i} className="flex-1 bg-[var(--insurai-surface-container-low)] rounded-t-lg relative overflow-hidden transition-all duration-300 hover:opacity-80" style={{ height: `${val}%` }}>
                                        <div className={`absolute bottom-0 w-full bg-gradient-to-t from-[var(--primary)] to-transparent h-full rounded-t-lg opacity-${val > 80 ? '80' : '30'}`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)]">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-['Manrope'] font-bold text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-xs">group</span>
                                Active System Presence
                            </h4>
                            <button onClick={() => router.push("/dashboard/admin/users")} className="text-xs font-bold text-[var(--primary)] hover:underline">
                                Manage
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-[var(--insurai-surface-container-low)] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[var(--insurai-outline-variant)]/10">
                                        <span className="material-symbols-outlined text-sm text-[var(--primary)]">person</span>
                                    </div>
                                    <span className="text-sm font-semibold">Customers</span>
                                </div>
                                <span className="text-sm font-bold">{isLoading ? "..." : data?.users.customers.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-[var(--insurai-surface-container-low)] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[var(--insurai-outline-variant)]/10">
                                        <span className="material-symbols-outlined text-sm text-[var(--primary)]">verified_user</span>
                                    </div>
                                    <span className="text-sm font-semibold">Underwriters</span>
                                </div>
                                <span className="text-sm font-bold">{isLoading ? "..." : data?.users.underwriters.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-[var(--insurai-surface-container-low)] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[var(--insurai-outline-variant)]/10">
                                        <span className="material-symbols-outlined text-sm text-[var(--primary)]">gavel</span>
                                    </div>
                                    <span className="text-sm font-semibold">Adjusters</span>
                                </div>
                                <span className="text-sm font-bold">{isLoading ? "..." : data?.users.adjusters.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)]">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-['Manrope'] font-bold text-sm">Knowledge Graph</h4>
                            <span className="material-symbols-outlined text-[var(--primary)] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-xs font-['Inter'] text-[var(--insurai-on-surface-variant)]">Policy Ingestion</p>
                                <p className="text-xs font-bold text-[var(--primary)]">100%</p>
                            </div>
                            <div className="h-2 w-full bg-[var(--insurai-surface-container-low)] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--insurai-primary-container)] w-[100%] rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-[11px] text-[var(--insurai-on-surface-variant)] leading-tight">
                            All semantic alignments mapped in Neo4j production cluster. System is fully coherent.
                        </p>
                    </div>

                    <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)] flex-1 overflow-hidden relative">
                        <h4 className="font-['Manrope'] font-bold text-sm mb-6">Global Audit Log</h4>
                        
                        {isLoading ? (
                            <div className="animate-pulse space-y-4">
                                {[1,2,3,4].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-2 h-2 rounded-full bg-[var(--insurai-outline-variant)]/30 mt-1.5"></div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-[var(--insurai-outline-variant)]/20 rounded w-full mb-2"></div>
                                            <div className="h-2 bg-[var(--insurai-outline-variant)]/10 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6 flex-1 min-h-[220px]">
                                {data?.auditLogs && data.auditLogs.map((log, i) => (
                                    <div key={i} className="flex gap-4 group cursor-default">
                                        <div className="relative">
                                            <div className={`w-2 h-2 rounded-full mt-1.5 transition-colors ${
                                                log.outcome === "blocked" ? "bg-red-500" : 
                                                log.outcome === "warning" ? "bg-amber-500" : 
                                                "bg-[var(--primary)]"
                                            }`}></div>
                                            {i < (data.auditLogs.length - 1) && (
                                                <div className="absolute top-4 left-[3px] w-[2px] h-10 bg-[var(--insurai-outline-variant)]/20 group-hover:bg-[var(--primary)]/20 transition-colors"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate">{log.action}</p>
                                            <p className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] mt-0.5 truncate">
                                                {log.actor_name} ({log.actor_badge}) • {formatTimeAgo(log.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {(!data?.auditLogs || data.auditLogs.length === 0) && (
                                    <p className="text-xs text-[var(--insurai-on-surface-variant)]">No recent audit logs found.</p>
                                )}
                            </div>
                        )}

                        <button onClick={() => router.push("/dashboard/admin/audit")} className="w-full mt-8 py-2 text-xs font-['Inter'] font-bold text-[var(--primary)] border border-[var(--primary)]/20 rounded-lg hover:bg-[var(--primary)]/5 transition-colors">
                            VIEW FULL LOGS
                        </button>
                    </div>
                </section>
            </div>

            <footer className="mt-16 pt-8 border-t border-[var(--insurai-outline-variant)]/10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest">Mainframe Link: Established</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest">Version 2.4.0-Stable</span>
                    </div>
                </div>
            </footer>

            <div className="fixed bottom-8 right-8 z-[60]">
                <button onClick={() => toast.success("Cluster synchronization triggered")} className="group bg-[var(--insurai-on-surface)] text-[var(--insurai-surface)] p-4 rounded-full shadow-2xl flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105 active:scale-95">
                    <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">bolt</span>
                    <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-bold text-sm px-0 group-hover:px-2">
                        SYNC CLUSTERS
                    </span>
                </button>
            </div>
        </div>
    );
}
