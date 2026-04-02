"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ClaimRecord } from "@/lib/demo-store";

type ClaimFilter = "all" | "urgent" | "assigned";

type ClaimsResponse = {
    claims?: ClaimRecord[];
    error?: string;
};

const teamActivity = [
    { name: "Sarah Chen", action: "Approved claim CL-88401", time: "2m ago", initials: "SC", color: "bg-blue-500" },
    { name: "Marcus Thorne", action: "Reopened claim CL-90122", time: "15m ago", initials: "MT", color: "bg-orange-500" },
    { name: "Elena Rodriguez", action: "Flagged property claim CL-77219", time: "1h ago", initials: "ER", color: "bg-purple-500" },
];

function statusStyle(status: string): string {
    if (status === "Urgent") {
        return "bg-[var(--insurai-error-container)] text-[#93000a]";
    }
    if (status === "Approved") {
        return "bg-green-100 text-green-700";
    }
    if (status === "Rejected") {
        return "bg-red-100 text-red-700";
    }
    if (status === "Closed") {
        return "bg-slate-100 text-slate-600";
    }

    return "bg-[var(--insurai-secondary-fixed)] text-[#001a41]";
}

function formatDateLabel(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

export default function AdjusterDashboard() {
    const router = useRouter();
    const [claims, setClaims] = useState<ClaimRecord[]>([]);
    const [activeFilter, setActiveFilter] = useState<ClaimFilter>("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadClaims = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/claims", { cache: "no-store" });
                const payload = (await response.json()) as ClaimsResponse;

                if (!response.ok) {
                    throw new Error(payload.error || "Unable to load claims.");
                }

                if (isMounted) {
                    setClaims(payload.claims || []);
                    setError(null);
                }
            } catch (loadError: unknown) {
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : "Unable to load claims.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadClaims();

        return () => {
            isMounted = false;
        };
    }, []);

    const urgentCount = useMemo(() => claims.filter((claim) => claim.status === "Urgent").length, [claims]);
    const assignedCount = useMemo(() => claims.filter((claim) => claim.highlighted).length, [claims]);

    const visibleClaims = useMemo(() => {
        if (activeFilter === "urgent") {
            return claims.filter((claim) => claim.status === "Urgent");
        }

        if (activeFilter === "assigned") {
            return claims.filter((claim) => claim.highlighted);
        }

        return claims;
    }, [activeFilter, claims]);

    const openNewAssessment = () => {
        toast("Opening AI assessment workspace...");
        router.push("/dashboard/adjuster/ask");
    };

    const reviewAiFlags = () => {
        setActiveFilter("urgent");
        toast.info("Showing AI-flagged urgent claims.");
    };

    return (
        <div className="pt-16 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in">
            <section className="mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tighter font-[Manrope] text-[var(--insurai-on-surface)]">
                            Claims Queue
                        </h1>
                        <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-xl">
                            Overview of active incident reports requiring manual assessment and verification.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setActiveFilter("all")}
                            className="px-5 py-2.5 rounded-lg border border-[var(--insurai-outline-variant)]/20 text-[var(--insurai-on-surface-variant)] font-medium hover:bg-[var(--insurai-surface-container-low)] transition-all"
                        >
                            Reset Queue
                        </button>
                        <button
                            onClick={openNewAssessment}
                            className="px-5 py-2.5 rounded-lg primary-gradient text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            New Assessment
                        </button>
                    </div>
                </div>
            </section>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="asymmetric-grid">
                <section className="space-y-6">
                    <div className="flex gap-8 border-b border-[var(--insurai-surface-container-high)] pb-4">
                        <button
                            onClick={() => setActiveFilter("all")}
                            className={`text-sm relative transition-colors ${
                                activeFilter === "all"
                                    ? "font-bold text-[var(--primary)]"
                                    : "font-medium text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)]"
                            }`}
                        >
                            All Claims ({claims.length})
                            {activeFilter === "all" && <span className="absolute -bottom-4 left-0 w-full h-0.5 bg-[var(--primary)]" />}
                        </button>
                        <button
                            onClick={() => setActiveFilter("urgent")}
                            className={`text-sm relative transition-colors ${
                                activeFilter === "urgent"
                                    ? "font-bold text-[var(--primary)]"
                                    : "font-medium text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)]"
                            }`}
                        >
                            Urgent ({urgentCount})
                            {activeFilter === "urgent" && <span className="absolute -bottom-4 left-0 w-full h-0.5 bg-[var(--primary)]" />}
                        </button>
                        <button
                            onClick={() => setActiveFilter("assigned")}
                            className={`text-sm relative transition-colors ${
                                activeFilter === "assigned"
                                    ? "font-bold text-[var(--primary)]"
                                    : "font-medium text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)]"
                            }`}
                        >
                            Assigned to Me ({assignedCount})
                            {activeFilter === "assigned" && <span className="absolute -bottom-4 left-0 w-full h-0.5 bg-[var(--primary)]" />}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-xl border border-[var(--insurai-outline-variant)]/20 text-center">
                                <p className="text-sm font-semibold text-[var(--insurai-on-surface)]">Loading claim queue...</p>
                            </div>
                        ) : (
                            visibleClaims.map((claim) => (
                                <Link
                                    key={claim.id}
                                    href={`/dashboard/adjuster/claim/${claim.id}`}
                                    className="block bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ambient-shadow ghost-border group hover:shadow-md transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold font-[Manrope] group-hover:text-[var(--primary)] transition-colors">
                                                {claim.title}
                                            </h3>
                                            <p className="text-sm font-[Inter] text-[var(--insurai-on-surface-variant)] flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">{claim.icon}</span>
                                                {claim.id}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusStyle(claim.status)}`}>
                                            {claim.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-[var(--insurai-surface-container-low)]">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-widest font-[Inter]">
                                                    Incident Date
                                                </span>
                                                <span className="text-sm font-medium">{formatDateLabel(claim.incidentDate)}</span>
                                            </div>
                                            <div className="w-px h-8 bg-[var(--insurai-surface-container-high)] mx-2" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-widest font-[Inter]">
                                                    Estimated Value
                                                </span>
                                                <span className="text-sm font-medium">{claim.estimatedAmount}</span>
                                            </div>
                                        </div>
                                        <span className="flex items-center gap-2 text-[var(--primary)] font-bold text-sm">
                                            Open Details
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}

                        {!isLoading && visibleClaims.length === 0 && (
                            <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-xl border border-[var(--insurai-outline-variant)]/20 text-center">
                                <p className="text-sm font-semibold text-[var(--insurai-on-surface)]">No claims match this filter.</p>
                                <p className="text-xs text-[var(--insurai-on-surface-variant)] mt-1">Try switching to a broader queue view.</p>
                            </div>
                        )}
                    </div>
                </section>

                <aside className="space-y-8">
                    <div className="bg-[var(--primary)] text-white p-8 rounded-2xl relative overflow-hidden shadow-xl">
                        <div className="relative z-10">
                            <span className="material-symbols-outlined text-3xl mb-4 block">auto_awesome</span>
                            <h4 className="text-xl font-bold font-[Manrope] mb-2">Smart Queue Priority</h4>
                            <p className="text-blue-100 text-sm leading-relaxed mb-6 opacity-90">
                                Claims with higher loss severity or property exposure are flagged for faster review.
                            </p>
                            <button
                                onClick={reviewAiFlags}
                                className="w-full py-3 bg-white text-[var(--primary)] rounded-lg font-bold text-sm shadow-sm hover:bg-opacity-90 transition-all"
                            >
                                Review AI Flags
                            </button>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--insurai-primary-container)] rounded-full blur-3xl opacity-50" />
                    </div>

                    <div className="bg-[var(--insurai-surface-container-low)] p-6 rounded-2xl">
                        <h4 className="text-xs font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-6">
                            Team Activity
                        </h4>
                        <div className="space-y-5">
                            {teamActivity.map((member) => (
                                <div key={member.name} className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${member.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                                        {member.initials}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold">{member.name}</p>
                                        <p className="text-[11px] text-[var(--insurai-on-surface-variant)]">{member.action}</p>
                                    </div>
                                    <span className="text-[10px] text-[var(--insurai-on-surface-variant)] font-medium">{member.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ghost-border">
                        <h4 className="text-xs font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-6">
                            Your Impact
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-[var(--insurai-surface-container-low)] rounded-xl">
                                <p className="text-[10px] font-bold text-[var(--insurai-on-surface-variant)] uppercase mb-1">Visible Claims</p>
                                <p className="text-2xl font-extrabold text-[var(--primary)]">{claims.length}</p>
                            </div>
                            <div className="p-4 bg-[var(--insurai-surface-container-low)] rounded-xl">
                                <p className="text-[10px] font-bold text-[var(--insurai-on-surface-variant)] uppercase mb-1">Urgent</p>
                                <p className="text-2xl font-extrabold text-[var(--primary)]">{urgentCount}</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
