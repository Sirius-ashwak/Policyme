"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const claims = [
    {
        id: "POL-8829-XJ",
        title: "Vehicle windshield damaged",
        icon: "policy",
        status: "Under Review",
        statusStyle: "bg-[var(--insurai-secondary-fixed)] text-[#001a41]",
        incidentDate: "Oct 14, 2023",
        estimatedValue: "$1,250.00",
        highlighted: false,
    },
    {
        id: "POL-1102-BQ",
        title: "Residential water damage (Kitchen)",
        icon: "home",
        status: "Urgent",
        statusStyle: "bg-[var(--insurai-error-container)] text-[#93000a]",
        incidentDate: "Oct 12, 2023",
        estimatedValue: "$12,400.00",
        highlighted: false,
    },
    {
        id: "POL-4491-ZT",
        title: "Minor collision - Rear bumper",
        icon: "directions_car",
        status: "Under Review",
        statusStyle: "bg-[var(--insurai-secondary-fixed)] text-[#001a41]",
        incidentDate: "Oct 15, 2023",
        estimatedValue: "$2,100.00",
        highlighted: true,
    },
];

const teamActivity = [
    { name: "Sarah Chen", action: "Approved claim POL-9921", time: "2m ago", initials: "SC", color: "bg-blue-500" },
    { name: "Marcus Thorne", action: "Reopened POL-8829", time: "15m ago", initials: "MT", color: "bg-orange-500" },
    { name: "Elena Rodriguez", action: "Flagged POL-1102", time: "1h ago", initials: "ER", color: "bg-purple-500" },
];

type ClaimFilter = "all" | "urgent" | "assigned";

const FILTER_SEQUENCE: ClaimFilter[] = ["all", "urgent", "assigned"];

const FILTER_LABELS: Record<ClaimFilter, string> = {
    all: "All Claims",
    urgent: "Urgent",
    assigned: "Assigned to Me",
};

export default function AdjusterDashboard() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<ClaimFilter>("all");

    const urgentCount = useMemo(() => claims.filter((claim) => claim.status === "Urgent").length, []);
    const assignedCount = useMemo(() => claims.filter((claim) => claim.highlighted).length, []);

    const visibleClaims = useMemo(() => {
        if (activeFilter === "urgent") {
            return claims.filter((claim) => claim.status === "Urgent");
        }

        if (activeFilter === "assigned") {
            return claims.filter((claim) => claim.highlighted);
        }

        return claims;
    }, [activeFilter]);

    const cycleQueueFilter = () => {
        const currentIndex = FILTER_SEQUENCE.indexOf(activeFilter);
        const nextFilter = FILTER_SEQUENCE[(currentIndex + 1) % FILTER_SEQUENCE.length];
        setActiveFilter(nextFilter);
        toast.success(`Queue filter set to ${FILTER_LABELS[nextFilter]}.`);
    };

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
            {/* Header Section */}
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
                                onClick={cycleQueueFilter}
                                className="px-5 py-2.5 rounded-lg border border-[var(--insurai-outline-variant)]/20 text-[var(--insurai-on-surface-variant)] font-medium hover:bg-[var(--insurai-surface-container-low)] transition-all"
                            >
                                Filter Queue
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

                {/* Asymmetric Layout Content */}
                <div className="asymmetric-grid">
                    {/* Left: Claims List */}
                    <section className="space-y-6">
                        {/* Status Tabs */}
                        <div className="flex gap-8 border-b border-[var(--insurai-surface-container-high)] pb-4">
                            <button
                                onClick={() => setActiveFilter("all")}
                                className={`text-sm relative transition-colors ${
                                    activeFilter === "all"
                                        ? "font-bold text-[var(--primary)]"
                                        : "font-medium text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)]"
                                }`}
                            >
                                All Claims (24)
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

                        {/* Claim Cards */}
                        <div className="space-y-4">
                            {visibleClaims.map((claim) => (
                                <Link
                                    key={claim.id}
                                    href={`/dashboard/adjuster/claim/${claim.id}`}
                                    className={`group block bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl ambient-shadow ambient-shadow-hover transition-all duration-300 cursor-pointer ${
                                        claim.highlighted ? "border-l-4 border-[var(--primary)]" : ""
                                    }`}
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
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${claim.statusStyle}`}>
                                            {claim.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-[var(--insurai-surface-container-low)]">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-widest font-[Inter]">
                                                    Incident Date
                                                </span>
                                                <span className="text-sm font-medium">{claim.incidentDate}</span>
                                            </div>
                                            <div className="w-px h-8 bg-[var(--insurai-surface-container-high)] mx-2" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-widest font-[Inter]">
                                                    Estimated Value
                                                </span>
                                                <span className="text-sm font-medium">{claim.estimatedValue}</span>
                                            </div>
                                        </div>
                                        <span className="flex items-center gap-2 text-[var(--primary)] font-bold text-sm">
                                            Open Details
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </span>
                                    </div>
                                </Link>
                            ))}
                            {visibleClaims.length === 0 && (
                                <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-xl border border-[var(--insurai-outline-variant)]/20 text-center">
                                    <p className="text-sm font-semibold text-[var(--insurai-on-surface)]">No claims match this filter.</p>
                                    <p className="text-xs text-[var(--insurai-on-surface-variant)] mt-1">Try switching to a broader queue view.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Right: Insights & Activity */}
                    <aside className="space-y-8">
                        {/* AI Insight Card */}
                        <div className="bg-[var(--primary)] text-white p-8 rounded-2xl relative overflow-hidden shadow-xl">
                            <div className="relative z-10">
                                <span className="material-symbols-outlined text-3xl mb-4 block">auto_awesome</span>
                                <h4 className="text-xl font-bold font-[Manrope] mb-2">Smart Queue Priority</h4>
                                <p className="text-blue-100 text-sm leading-relaxed mb-6 opacity-90">
                                    InsurAI has flagged 4 claims as potentially fraudulent based on GraphRAG metadata analysis. We recommend reviewing these first.
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

                        {/* Team Activity */}
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

                        {/* Performance Metrics */}
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ghost-border">
                            <h4 className="text-xs font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-6">
                                Your Impact
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-[var(--insurai-surface-container-low)] rounded-xl">
                                    <p className="text-[10px] font-bold text-[var(--insurai-on-surface-variant)] uppercase mb-1">Resolved Today</p>
                                    <p className="text-2xl font-extrabold text-[var(--primary)]">12</p>
                                </div>
                                <div className="p-4 bg-[var(--insurai-surface-container-low)] rounded-xl">
                                    <p className="text-[10px] font-bold text-[var(--insurai-on-surface-variant)] uppercase mb-1">Avg Time</p>
                                    <p className="text-2xl font-extrabold text-[var(--primary)]">42m</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
        </div>
    );
}
