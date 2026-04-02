"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Bot, Download, Search, ShieldCheck, UserCog, Workflow } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuditLogRecord, AuditMetricsRecord } from "@/lib/demo-store";

type AuditResponse = {
    metrics?: AuditMetricsRecord;
    logs?: AuditLogRecord[];
    error?: string;
};

type ActorFilter = "all" | AuditLogRecord["actorKind"];

const actorFilterOptions: { value: ActorFilter; label: string }[] = [
    { value: "all", label: "All Sources" },
    { value: "user", label: "Users" },
    { value: "ai", label: "AI Agents" },
    { value: "system", label: "System" },
];

function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
        return timestamp;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function metricValue(value: number | undefined): string {
    if (typeof value !== "number") {
        return "--";
    }

    return value.toLocaleString();
}

export default function AuditLogsPage() {
    const [metrics, setMetrics] = useState<AuditMetricsRecord | null>(null);
    const [logs, setLogs] = useState<AuditLogRecord[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [actorFilter, setActorFilter] = useState<ActorFilter>("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadAuditData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/admin/audit", { cache: "no-store" });
                const payload = (await response.json()) as AuditResponse;

                if (!response.ok) {
                    throw new Error(payload.error || "Unable to load audit ledger.");
                }

                if (isMounted) {
                    setMetrics(payload.metrics || null);
                    setLogs(payload.logs || []);
                    setError(null);
                }
            } catch (loadError: unknown) {
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : "Unable to load audit ledger.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadAuditData();

        return () => {
            isMounted = false;
        };
    }, []);

    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filteredLogs = logs.filter((log) => {
        const matchesActor = actorFilter === "all" || log.actorKind === actorFilter;
        const haystack = [
            String(log.sequence),
            log.actorName,
            log.actorMeta,
            log.action,
            log.hash,
            log.statusLabel,
        ]
            .join(" ")
            .toLowerCase();
        const matchesSearch = normalizedSearch.length === 0 || haystack.includes(normalizedSearch);
        return matchesActor && matchesSearch;
    });

    const exportLogs = () => {
        if (filteredLogs.length === 0) {
            toast.error("There are no audit rows to export.");
            return;
        }

        const rows = [
            ["sequence", "timestamp", "timezone", "actor", "actor_kind", "actor_meta", "action", "hash", "status", "anomaly"],
            ...filteredLogs.map((log) => [
                String(log.sequence),
                log.timestamp,
                log.timezoneLabel,
                log.actorName,
                log.actorKind,
                log.actorMeta,
                log.action,
                log.hash,
                log.statusLabel,
                log.anomaly ? "true" : "false",
            ]),
        ];
        const csv = rows
            .map((row) => row.map((value) => `"${value.replace(/"/g, "\"\"")}"`).join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "policyme_audit_logs.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);

        toast.success(`Exported ${filteredLogs.length} audit rows.`);
    };

    const copyHash = async (hash: string) => {
        try {
            await navigator.clipboard.writeText(hash);
            toast.success("Event hash copied.");
        } catch {
            toast.error("Unable to copy event hash.");
        }
    };

    return (
        <div className="flex-1 w-full bg-[var(--insurai-surface)] font-['Manrope'] px-6 md:px-10 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--insurai-on-surface)]">
                        System Audit Logs
                    </h1>
                    <p className="text-[var(--insurai-on-surface-variant)] leading-relaxed max-w-xl">
                        Immutable ledger of administrative actions, AI overrides, graph events, and authentication activity.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-[var(--insurai-surface-container-lowest)] p-2 rounded-xl shadow-sm border border-[var(--insurai-outline-variant)]/10 w-full md:w-auto">
                        <div className="relative min-w-[260px]">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--insurai-on-surface-variant)]" />
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search event hash, actor, or action..."
                                className="pl-9 bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            {actorFilterOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    type="button"
                                    size="sm"
                                    variant={actorFilter === option.value ? "default" : "ghost"}
                                    onClick={() => setActorFilter(option.value)}
                                    className="text-xs"
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Button type="button" onClick={exportLogs} className="gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {error && (
                <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[var(--insurai-surface-container-lowest)] p-4 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-widest mb-0.5">Auth Events</p>
                        <p className="text-xl font-bold text-[var(--insurai-on-surface)]">{metricValue(metrics?.authEvents)}</p>
                    </div>
                </div>

                <div className="bg-[var(--insurai-surface-container-lowest)] p-4 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                        <Workflow className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-widest mb-0.5">Graph Writes</p>
                        <p className="text-xl font-bold text-[var(--insurai-on-surface)]">{metricValue(metrics?.graphWrites)}</p>
                    </div>
                </div>

                <div className="bg-[var(--insurai-surface-container-lowest)] p-4 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500">
                        <UserCog className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-widest mb-0.5">Overrides</p>
                        <p className="text-xl font-bold text-[var(--insurai-on-surface)]">{metricValue(metrics?.overrides)}</p>
                    </div>
                </div>

                <div className="bg-[var(--insurai-surface-container-lowest)] p-4 rounded-xl border-2 border-red-500/20 shadow-[0_4px_12px_rgba(239,68,68,0.05)] flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-0.5">Anomalies</p>
                        <p className="text-xl font-bold text-red-700 dark:text-red-300">{metricValue(metrics?.anomalies)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--insurai-surface-container-lowest)] rounded-2xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="p-4 border-b border-[var(--insurai-surface-container-high)] flex items-center justify-between bg-[var(--insurai-surface-container-low)]/50">
                    <h3 className="text-sm font-bold text-[var(--insurai-on-surface)]">Unified Compliance Ledger</h3>
                    <div className="text-xs font-semibold text-[var(--insurai-on-surface-variant)]">
                        {actorFilterOptions.find((option) => option.value === actorFilter)?.label}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8f9fc] dark:bg-slate-900/50 border-b border-[var(--insurai-outline-variant)]/5">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] w-12">Seq</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Actor</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Event Hash / Action</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] text-right">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--insurai-surface-container-highest)]/30 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-sm text-[var(--insurai-on-surface-variant)]">
                                        Loading audit ledger...
                                    </td>
                                </tr>
                            ) : filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => {
                                    const isBlocked = log.outcome === "blocked";
                                    const rowClasses = isBlocked
                                        ? "border-l-2 border-l-red-500 bg-red-50/10 dark:bg-red-900/5"
                                        : "";
                                    const badgeClasses = isBlocked
                                        ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
                                        : log.outcome === "recorded"
                                            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                            : "text-slate-500";
                                    const actorBadgeClasses = log.actorKind === "ai"
                                        ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                        : log.actorKind === "system"
                                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500"
                                            : "bg-[var(--insurai-primary-fixed)] dark:bg-[var(--primary)]/20 text-[var(--primary)]";

                                    return (
                                        <tr
                                            key={`${log.sequence}-${log.hash}`}
                                            className={`hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors group ${rowClasses}`}
                                        >
                                            <td className="px-6 py-4 font-mono text-[10px] text-[var(--insurai-on-surface-variant)] font-semibold">
                                                {log.sequence}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-xs text-[var(--insurai-on-surface)] block">
                                                    {formatTimestamp(log.timestamp)}
                                                </span>
                                                <span className="text-[10px] text-[var(--insurai-on-surface-variant)]">
                                                    {log.timezoneLabel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] ${actorBadgeClasses}`}>
                                                        {log.actorKind === "ai" ? <Bot className="h-3.5 w-3.5" /> : log.actorBadge}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-xs text-[var(--insurai-on-surface)]">{log.actorName}</p>
                                                        <p className="text-[10px] text-[var(--insurai-outline)] font-mono mt-0.5">{log.actorMeta}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-xs text-[var(--insurai-on-surface)]">{log.action}</p>
                                                <p className="text-[10px] text-[var(--insurai-outline)] font-mono mt-0.5 tracking-wider truncate max-w-[260px]">
                                                    {log.hash}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded ${badgeClasses}`}>
                                                    {log.statusLabel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => void copyHash(log.hash)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    Copy Hash
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-sm text-[var(--insurai-on-surface-variant)]">
                                        No audit rows match the current search and source filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 flex items-center justify-between border-t border-[var(--insurai-surface-container-high)] bg-[var(--insurai-surface-container-lowest)]">
                    <p className="text-[11px] font-semibold text-[var(--insurai-on-surface-variant)]">
                        Showing <span className="font-bold text-[var(--insurai-on-surface)]">{filteredLogs.length}</span> of{" "}
                        <span className="font-bold text-[var(--insurai-on-surface)]">
                            {metricValue(metrics?.totalEntries)}
                        </span>{" "}
                        ledger entries
                    </p>
                    <div className="text-[11px] font-semibold text-[var(--insurai-on-surface-variant)]">
                        {filteredLogs.filter((log) => log.anomaly).length} anomaly rows in view
                    </div>
                </div>
            </div>
        </div>
    );
}
