"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { UnderwritingApplication } from "@/lib/demo-store";

type QueueFilter = "all" | "high-risk" | "commercial";

type ApplicationsResponse = {
    applications?: UnderwritingApplication[];
    error?: string;
    details?: string;
};

const FILTER_ORDER: QueueFilter[] = ["all", "high-risk", "commercial"];

const FILTER_LABELS: Record<QueueFilter, string> = {
    all: "All Applications",
    "high-risk": "High Risk",
    commercial: "Commercial",
};

function statusLabel(status: string): string {
    if (status === "Approved") {
        return "text-green-600";
    }
    if (status === "Rejected") {
        return "text-red-600";
    }

    return "text-orange-600";
}

function riskColor(score: number | null): string {
    if (score === null) {
        return "bg-slate-300";
    }
    if (score >= 75) {
        return "bg-green-500";
    }
    if (score >= 40) {
        return "bg-orange-500";
    }

    return "bg-red-500";
}

export default function UnderwriterDashboard() {
    const [applications, setApplications] = useState<UnderwritingApplication[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [queueFilter, setQueueFilter] = useState<QueueFilter>("all");
    const [autoApprove, setAutoApprove] = useState(true);
    const [approvalThreshold, setApprovalThreshold] = useState(85);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isBatchRunning, setIsBatchRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pageSize = 3;

    const loadApplications = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/applications", { cache: "no-store" });
            const payload = (await response.json()) as ApplicationsResponse;

            if (!response.ok) {
                throw new Error(payload.error || "Unable to load applications.");
            }

            setApplications(payload.applications || []);
            setError(null);
        } catch (loadError: unknown) {
            setError(loadError instanceof Error ? loadError.message : "Unable to load applications.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadApplications();
    }, []);

    const filteredApplications = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return applications.filter((application) => {
            const score = application.assessment?.riskScore ?? null;
            const matchesSearch =
                query.length === 0 ||
                application.id.toLowerCase().includes(query) ||
                application.applicantName.toLowerCase().includes(query) ||
                application.applicantEmail.toLowerCase().includes(query) ||
                application.policyType.toLowerCase().includes(query);

            const matchesFilter =
                queueFilter === "all" ||
                (queueFilter === "high-risk" && score !== null && score < 50) ||
                (queueFilter === "commercial" && application.policyType.toLowerCase().includes("commercial"));

            return matchesSearch && matchesFilter;
        });
    }, [applications, queueFilter, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedApplications = useMemo(() => {
        const start = (safeCurrentPage - 1) * pageSize;
        return filteredApplications.slice(start, start + pageSize);
    }, [filteredApplications, safeCurrentPage]);

    const cycleFilter = () => {
        const currentIndex = FILTER_ORDER.indexOf(queueFilter);
        const nextFilter = FILTER_ORDER[(currentIndex + 1) % FILTER_ORDER.length];
        setQueueFilter(nextFilter);
        setCurrentPage(1);
        toast.success(`Queue filter set to ${FILTER_LABELS[nextFilter]}.`);
    };

    const runAutoBatch = async () => {
        if (isBatchRunning) {
            return;
        }

        if (filteredApplications.length === 0) {
            toast.error("No applications match the current filter.");
            return;
        }

        setIsBatchRunning(true);

        try {
            const targets = filteredApplications.slice(0, 10);
            const results = await Promise.allSettled(
                targets.map(async (application) => {
                    const response = await fetch(`/api/applications/${application.id}/assess`, {
                        method: "POST",
                    });

                    if (!response.ok) {
                        const payload = (await response.json()) as ApplicationsResponse;
                        throw new Error(payload.details || payload.error || "Assessment failed.");
                    }
                })
            );

            const successCount = results.filter((result) => result.status === "fulfilled").length;
            const failureCount = results.length - successCount;

            await loadApplications();

            if (failureCount === 0) {
                toast.success(`Processed ${successCount} applications using threshold > ${approvalThreshold}.`);
            } else {
                toast.error(`Processed ${successCount} applications, ${failureCount} failed. Check backend connectivity.`);
            }
        } finally {
            setIsBatchRunning(false);
        }
    };

    const openBatchSettings = () => {
        toast("Auto-batch settings", {
            description: `Current rule: ${autoApprove ? "enabled" : "disabled"} with score > ${approvalThreshold}.`,
        });
    };

    const exportQueue = () => {
        if (filteredApplications.length === 0) {
            toast.error("Nothing to export for the current search/filter.");
            return;
        }

        const header = ["id", "applicantName", "applicantEmail", "policyType", "riskScore", "status"];
        const rows = filteredApplications.map((application) => [
            application.id,
            application.applicantName,
            application.applicantEmail,
            application.policyType,
            String(application.assessment?.riskScore ?? ""),
            application.status,
        ]);

        const csvContent = [header, ...rows]
            .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
            .join("\n");

        const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const downloadUrl = URL.createObjectURL(csvBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `underwriter_queue_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);

        toast.success(`Exported ${filteredApplications.length} applications.`);
    };

    const toggleAutoApprove = () => {
        setAutoApprove((current) => {
            const nextValue = !current;
            toast(nextValue ? "Auto-approve enabled" : "Auto-approve disabled", {
                description: `Current approval threshold is ${approvalThreshold}.`,
            });
            return nextValue;
        });
    };

    const adjustGlobalThreshold = () => {
        setApprovalThreshold((current) => {
            const nextValue = current >= 95 ? 75 : current + 5;
            toast.success(`Global threshold updated to ${nextValue}.`);
            return nextValue;
        });
    };

    const goToPreviousPage = () => {
        if (safeCurrentPage <= 1) {
            return;
        }

        setCurrentPage(safeCurrentPage - 1);
    };

    const goToNextPage = () => {
        if (safeCurrentPage >= totalPages) {
            return;
        }

        setCurrentPage(safeCurrentPage + 1);
    };

    const pendingCount = applications.filter((application) => application.status === "Pending Review").length;
    const averageScore = applications.length
        ? Math.round(
            applications.reduce((total, application) => total + (application.assessment?.riskScore ?? 0), 0) / applications.length
        )
        : 0;

    return (
        <div className="pt-16 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in">
            <section className="mb-10">
                <p className="text-xs font-bold uppercase tracking-widest font-[Inter] text-[var(--primary)] mb-2">
                    Underwriting Workspace
                </p>
                <h1 className="text-4xl font-extrabold tracking-tighter font-[Manrope] text-[var(--insurai-on-surface)] mb-3">
                    Application Queue
                </h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-sm max-w-xl leading-relaxed">
                    Manage pending risk assessments and automated policy validations. Priorities are calculated from shared application data and live underwriting runs.
                </p>
            </section>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ghost-border">
                    <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2">
                        Total Pending
                    </p>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-extrabold">{pendingCount}</span>
                        <span className="text-sm font-bold text-green-600 mb-1">live</span>
                    </div>
                </div>
                <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ghost-border">
                    <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2">
                        Avg. Risk Score
                    </p>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-extrabold">{averageScore}</span>
                        <span className="text-sm font-bold text-orange-500 mb-1">dynamic</span>
                    </div>
                </div>
                <div className="bg-[var(--primary)] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">
                        AI Optimization
                    </p>
                    <h4 className="text-lg font-bold mb-3">Priority Filter Active</h4>
                    <div className="flex gap-3">
                        <button
                            onClick={() => void runAutoBatch()}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                            disabled={isBatchRunning}
                        >
                            {isBatchRunning ? "Running..." : "Run Auto-Batch"}
                        </button>
                        <button
                            onClick={openBatchSettings}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold border border-white/20 transition-colors"
                        >
                            Settings
                        </button>
                    </div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[var(--insurai-primary-container)] rounded-full blur-3xl opacity-40" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                    <input
                        type="text"
                        placeholder="Search profiles..."
                        value={searchQuery}
                        onChange={(event) => {
                            setSearchQuery(event.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-12 pr-4 py-3 bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/15 rounded-xl text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={cycleFilter}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--insurai-on-surface-variant)] hover:bg-[var(--insurai-surface-container-low)] rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">tune</span>
                        Filter
                    </button>
                    <button
                        onClick={exportQueue}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--insurai-on-surface-variant)] hover:bg-[var(--insurai-surface-container-low)] rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-[var(--insurai-surface-container-lowest)] rounded-2xl ambient-shadow ghost-border overflow-hidden mb-8">
                <table className="w-full insurai-table">
                    <thead>
                        <tr className="border-b border-[var(--insurai-surface-container-high)]">
                            <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)]">
                                Applicant
                            </th>
                            <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)]">
                                Policy Type
                            </th>
                            <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)]">
                                Risk Score
                            </th>
                            <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)]">
                                Status
                            </th>
                            <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)]">
                                Date Submitted
                            </th>
                            <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)]">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-sm text-[var(--insurai-on-surface-variant)]">
                                    Loading application queue...
                                </td>
                            </tr>
                        ) : (
                            paginatedApplications.map((application) => {
                                const score = application.assessment?.riskScore ?? null;
                                const scoreWidth = score === null ? "5%" : `${Math.max(8, Math.min(score, 100))}%`;

                                return (
                                    <tr key={application.id} className="hover:bg-[var(--insurai-surface-container-low)] transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    {application.applicantName.split(" ").map((segment) => segment[0]).join("").slice(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{application.applicantName}</p>
                                                    <p className="text-xs text-[var(--insurai-on-surface-variant)]">{application.applicantEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)] text-lg">{application.policyIcon}</span>
                                                <span className="text-sm">{application.policyType}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-2 bg-[var(--insurai-surface-container-high)] rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${riskColor(score)} rounded-full transition-all`}
                                                        style={{ width: scoreWidth }}
                                                    />
                                                </div>
                                                <span className="text-sm font-bold">{score ?? "--"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-xs font-bold uppercase tracking-wider ${statusLabel(application.status)}`}>
                                                {application.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm">{application.submittedAt}</td>
                                        <td className="px-6 py-5 text-right">
                                            <Link
                                                href={`/dashboard/underwriter/assess/${application.id}`}
                                                className="px-4 py-2 primary-gradient text-white rounded-lg text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all inline-block"
                                            >
                                                Assess
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        {!isLoading && paginatedApplications.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-sm text-[var(--insurai-on-surface-variant)]">
                                    No applications match your current search and filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--insurai-surface-container-high)]">
                    <span className="text-xs text-[var(--insurai-on-surface-variant)]">
                        Showing {paginatedApplications.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1} to {(safeCurrentPage - 1) * pageSize + paginatedApplications.length} of {filteredApplications.length} results ({FILTER_LABELS[queueFilter]})
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={goToPreviousPage}
                            disabled={safeCurrentPage <= 1}
                            className="w-8 h-8 rounded-lg border border-[var(--insurai-outline-variant)]/20 flex items-center justify-center text-[var(--insurai-on-surface-variant)] hover:bg-[var(--insurai-surface-container-low)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <button
                            onClick={goToNextPage}
                            disabled={safeCurrentPage >= totalPages}
                            className="w-8 h-8 rounded-lg border border-[var(--insurai-outline-variant)]/20 flex items-center justify-center text-[var(--insurai-on-surface-variant)] hover:bg-[var(--insurai-surface-container-low)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <button
                    onClick={toggleAutoApprove}
                    className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ghost-border text-left"
                >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Auto Approve</p>
                    <p className="text-2xl font-extrabold mt-2">{autoApprove ? "Enabled" : "Disabled"}</p>
                </button>
                <button
                    onClick={adjustGlobalThreshold}
                    className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ghost-border text-left"
                >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Approval Threshold</p>
                    <p className="text-2xl font-extrabold mt-2">{approvalThreshold}</p>
                </button>
            </div>
        </div>
    );
}
