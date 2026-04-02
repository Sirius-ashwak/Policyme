"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const applicants = [
    {
        name: "Sarah Mitchell",
        email: "sm.design@email.com",
        initials: "SM",
        initialsColor: "bg-blue-500",
        policyType: "Residential Premium",
        policyIcon: "home",
        riskScore: 82,
        riskColor: "bg-green-500",
        riskBarWidth: "w-[82%]",
        status: "Pending Review",
        date: "Oct 24, 2023",
    },
    {
        name: "James Harrison",
        email: "j.harrison@corp.net",
        initials: "JH",
        initialsColor: "bg-indigo-500",
        policyType: "Commercial Auto",
        policyIcon: "directions_car",
        riskScore: 45,
        riskColor: "bg-orange-500",
        riskBarWidth: "w-[45%]",
        status: "Pending Review",
        date: "Oct 23, 2023",
    },
    {
        name: "Aria Khel",
        email: "aria.k@cloud.com",
        initials: "AK",
        initialsColor: "bg-emerald-500",
        policyType: "Health Comprehensive",
        policyIcon: "favorite",
        riskScore: 94,
        riskColor: "bg-green-500",
        riskBarWidth: "w-[94%]",
        status: "Pending Review",
        date: "Oct 23, 2023",
    },
    {
        name: "Thomas Baxter",
        email: "tbaxter@consultancy.io",
        initials: "TB",
        initialsColor: "bg-rose-500",
        policyType: "Liability Plus",
        policyIcon: "shield",
        riskScore: 28,
        riskColor: "bg-red-500",
        riskBarWidth: "w-[28%]",
        status: "Pending Review",
        date: "Oct 22, 2023",
    },
];

type QueueFilter = "all" | "high-risk" | "commercial";

const FILTER_ORDER: QueueFilter[] = ["all", "high-risk", "commercial"];

const FILTER_LABELS: Record<QueueFilter, string> = {
    all: "All Applications",
    "high-risk": "High Risk",
    commercial: "Commercial",
};

export default function UnderwriterDashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [queueFilter, setQueueFilter] = useState<QueueFilter>("all");
    const [autoApprove, setAutoApprove] = useState(true);
    const [approvalThreshold, setApprovalThreshold] = useState(85);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;

    const filteredApplicants = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return applicants.filter((applicant) => {
            const matchesSearch =
                query.length === 0 ||
                applicant.name.toLowerCase().includes(query) ||
                applicant.email.toLowerCase().includes(query) ||
                applicant.policyType.toLowerCase().includes(query);

            const matchesFilter =
                queueFilter === "all" ||
                (queueFilter === "high-risk" && applicant.riskScore < 50) ||
                (queueFilter === "commercial" && applicant.policyType.toLowerCase().includes("commercial"));

            return matchesSearch && matchesFilter;
        });
    }, [queueFilter, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredApplicants.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedApplicants = useMemo(() => {
        const start = (safeCurrentPage - 1) * pageSize;
        return filteredApplicants.slice(start, start + pageSize);
    }, [filteredApplicants, safeCurrentPage]);

    const cycleFilter = () => {
        const currentIndex = FILTER_ORDER.indexOf(queueFilter);
        const nextFilter = FILTER_ORDER[(currentIndex + 1) % FILTER_ORDER.length];
        setQueueFilter(nextFilter);
        setCurrentPage(1);
        toast.success(`Queue filter set to ${FILTER_LABELS[nextFilter]}.`);
    };

    const runAutoBatch = () => {
        if (filteredApplicants.length === 0) {
            toast.error("No applications match the current filter.");
            return;
        }

        const processedCount = Math.min(10, filteredApplicants.length);
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1200)), {
            loading: "Running automated underwriting batch...",
            success: `Processed ${processedCount} applications using threshold > ${approvalThreshold}.`,
            error: "Auto-batch failed",
        });
    };

    const openBatchSettings = () => {
        toast("Auto-batch settings", {
            description: `Current rule: ${autoApprove ? "enabled" : "disabled"} with score > ${approvalThreshold}.`,
        });
    };

    const exportQueue = () => {
        if (filteredApplicants.length === 0) {
            toast.error("Nothing to export for the current search/filter.");
            return;
        }

        const header = "name,email,policyType,riskScore,status,dateSubmitted";
        const rows = filteredApplicants
            .map((applicant) => `${applicant.name},${applicant.email},${applicant.policyType},${applicant.riskScore},${applicant.status},${applicant.date}`)
            .join("\n");
        const csvContent = `${header}\n${rows}`;
        const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const downloadUrl = URL.createObjectURL(csvBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `underwriter_queue_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);

        toast.success(`Exported ${filteredApplicants.length} applications.`);
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

    return (
        <div className="pt-16 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in">
            {/* Header */}
            <section className="mb-10">
                <p className="text-xs font-bold uppercase tracking-widest font-[Inter] text-[var(--primary)] mb-2">
                    Underwriting Workspace
                </p>
                <h1 className="text-4xl font-extrabold tracking-tighter font-[Manrope] text-[var(--insurai-on-surface)] mb-3">
                    Application Queue
                </h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-sm max-w-xl leading-relaxed">
                    Manage pending risk assessments and automated policy validations. Priorities are calculated based on AI confidence scores.
                </p>
            </section>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ghost-border">
                    <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2">
                        Total Pending
                    </p>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-extrabold">124</span>
                        <span className="text-sm font-bold text-green-600 mb-1">+12%</span>
                    </div>
                </div>
                <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ghost-border">
                    <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2">
                        Avg. Risk Score
                    </p>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-extrabold">68</span>
                        <span className="text-sm font-bold text-orange-500 mb-1">Moderate</span>
                    </div>
                </div>
                <div className="bg-[var(--primary)] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">
                        AI Optimization
                    </p>
                    <h4 className="text-lg font-bold mb-3">Priority Filter Active</h4>
                    <div className="flex gap-3">
                        <button
                            onClick={runAutoBatch}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors"
                        >
                            Run Auto-Batch
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

            {/* Search & Filter Bar */}
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

            {/* Data Table */}
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
                        {paginatedApplicants.map((app) => (
                            <tr key={app.email} className="hover:bg-[var(--insurai-surface-container-low)] transition-colors">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 ${app.initialsColor} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                                            {app.initials}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{app.name}</p>
                                            <p className="text-xs text-[var(--insurai-on-surface-variant)]">{app.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)] text-lg">{app.policyIcon}</span>
                                        <span className="text-sm">{app.policyType}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-2 bg-[var(--insurai-surface-container-high)] rounded-full overflow-hidden">
                                            <div className={`h-full ${app.riskColor} ${app.riskBarWidth} rounded-full transition-all`} />
                                        </div>
                                        <span className="text-sm font-bold">{app.riskScore}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-sm">{app.date}</td>
                                <td className="px-6 py-5 text-right">
                                    <Link
                                        href={`/dashboard/underwriter/assess/${app.initials}`}
                                        className="px-4 py-2 primary-gradient text-white rounded-lg text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all inline-block"
                                    >
                                        Assess
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {paginatedApplicants.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-sm text-[var(--insurai-on-surface-variant)]">
                                    No applications match your current search and filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--insurai-surface-container-high)]">
                    <span className="text-xs text-[var(--insurai-on-surface-variant)]">
                        Showing {paginatedApplicants.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1} to {(safeCurrentPage - 1) * pageSize + paginatedApplicants.length} of {filteredApplicants.length} results ({FILTER_LABELS[queueFilter]})
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

            {/* Bottom Section: Risk Analysis + Automated Underwriting */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Risk Distribution */}
                <div className="lg:col-span-8 bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                    <h3 className="text-xl font-bold mb-3">Risk Distribution Analysis</h3>
                    <p className="text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed mb-8">
                        AI has flagged a 15% increase in high-risk volatility for &quot;Commercial Auto&quot; policies in the Northeast region. It is recommended to apply the &apos;Conservative Risk&apos; filter to your next assessment batch.
                    </p>
                    <div className="flex gap-12">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-1">Low Risk</p>
                            <p className="text-3xl font-extrabold text-green-600">62%</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-1">Med Risk</p>
                            <p className="text-3xl font-extrabold text-orange-500">28%</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-1">High Risk</p>
                            <p className="text-3xl font-extrabold text-red-500">10%</p>
                        </div>
                    </div>
                </div>

                {/* Automated Underwriting */}
                <div className="lg:col-span-4 bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                    <h4 className="font-bold mb-4">Automated Underwriting</h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--insurai-on-surface-variant)]">Current threshold:</span>
                            <span className="text-sm font-bold">
                                Score &gt; <span className="text-[var(--primary)]">{approvalThreshold}</span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--insurai-on-surface-variant)]">Auto-approve active</span>
                            <div
                                onClick={toggleAutoApprove}
                                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${autoApprove ? "bg-[var(--primary)]" : "bg-slate-300 dark:bg-slate-700"}`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${autoApprove ? "right-0.5" : "left-0.5"}`} />
                            </div>
                        </div>
                        <button
                            onClick={adjustGlobalThreshold}
                            className="w-full py-3 bg-[var(--insurai-surface-container-high)] text-[var(--insurai-on-surface)] font-bold rounded-xl hover:bg-[var(--insurai-surface-container-highest)] transition-colors mt-4"
                        >
                            Adjust Global Threshold
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
