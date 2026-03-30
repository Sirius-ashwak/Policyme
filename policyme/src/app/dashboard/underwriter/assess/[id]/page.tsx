"use client";

import Link from "next/link";

const riskFactors = [
    {
        title: "Modernized Fire Suppression",
        detail: "System upgrade completed in Q3 2023. Reduces fire-related risk variance by 32% compared to regional baseline.",
        icon: "check_circle",
        iconColor: "text-green-600",
        borderColor: "border-green-500",
    },
    {
        title: "Geographic Exposure",
        detail: "Asset is within a secondary flood zone. Recommended additional structural validation for basement-level coverage.",
        icon: "warning",
        iconColor: "text-orange-500",
        borderColor: "border-orange-500",
    },
    {
        title: "Tenant Credit Mix",
        detail: "Current tenant roster features 80% investment-grade companies. Provides significant stability to rental income coverage.",
        icon: "info",
        iconColor: "text-blue-500",
        borderColor: "border-blue-500",
    },
];

const entityProfile = [
    { label: "Asset Value", value: "$14.2M", valueColor: "" },
    { label: "Occupancy Rate", value: "94%", valueColor: "" },
    { label: "Years in Portfolio", value: "8 Years", valueColor: "" },
    { label: "Claims History", value: "Low (1)", valueColor: "text-green-600" },
];

export default function RiskAssessorPage() {
    return (
        <div className="pt-16 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in">
            {/* Breadcrumb & Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10">
                <div>
                    <div className="flex items-center gap-2 text-sm text-[var(--insurai-on-surface-variant)] mb-3">
                        <Link href="/dashboard/underwriter" className="hover:text-[var(--primary)] transition-colors">
                            Assessments
                        </Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span>Commercial Property</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter font-[Manrope] mb-2">
                        APP-94281: Meridian Plaza
                    </h1>
                    <p className="text-sm text-[var(--insurai-on-surface-variant)]">
                        Submission Date: Oct 24, 2023 • Applicant: Sterling Real Estate Holdings
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 rounded-lg border border-[var(--insurai-outline-variant)]/20 text-[var(--insurai-on-surface-variant)] font-medium hover:bg-[var(--insurai-surface-container-low)] transition-all">
                        Flag Review
                    </button>
                    <button className="px-5 py-2.5 rounded-lg primary-gradient text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                        Edit Application
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Left: Score + Profile */}
                <div className="space-y-8">
                    {/* AI Confidence Score */}
                    <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border flex flex-col items-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-6">
                            AI Confidence Score
                        </p>
                        {/* Circular Gauge */}
                        <div className="relative w-48 h-48 mb-6">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                <circle
                                    cx="60" cy="60" r="52"
                                    stroke="var(--insurai-surface-container-high)"
                                    strokeWidth="8"
                                    fill="none"
                                />
                                <circle
                                    cx="60" cy="60" r="52"
                                    stroke="var(--primary)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 52}`}
                                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - 0.85)}`}
                                    strokeLinecap="round"
                                    className="confidence-ring"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-extrabold">85</span>
                                <span className="text-sm text-[var(--insurai-on-surface-variant)]">/ 100</span>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-green-600 uppercase tracking-wider">High Confidence</span>
                        <p className="text-xs text-[var(--insurai-on-surface-variant)] text-center mt-3 max-w-xs leading-relaxed">
                            Analysis based on 42 historical data points and current market volatility metrics.
                        </p>
                    </div>

                    {/* Entity Profile */}
                    <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                        <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-6">
                            Entity Profile
                        </p>
                        <div className="space-y-4">
                            {entityProfile.map((item) => (
                                <div key={item.label} className="flex justify-between items-center py-2">
                                    <span className="text-sm text-[var(--insurai-on-surface-variant)]">{item.label}</span>
                                    <span className={`text-sm font-bold ${item.valueColor}`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Risk Factors + Recommendation */}
                <div className="space-y-8">
                    {/* Risk Factors Analysis */}
                    <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Risk Factors Analysis</h3>
                            <a href="#" className="text-sm text-[var(--primary)] font-semibold flex items-center gap-1 hover:underline">
                                View Full Report
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </a>
                        </div>
                        <div className="space-y-4">
                            {riskFactors.map((factor) => (
                                <div key={factor.title} className={`border-l-4 ${factor.borderColor} bg-[var(--insurai-surface-container-low)] p-5 rounded-r-xl`}>
                                    <div className="flex items-start gap-3">
                                        <span className={`material-symbols-outlined ${factor.iconColor} mt-0.5`}>{factor.icon}</span>
                                        <div>
                                            <h4 className="font-bold text-sm mb-1">{factor.title}</h4>
                                            <p className="text-xs text-[var(--insurai-on-surface-variant)] leading-relaxed">{factor.detail}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Automated Recommendation */}
                    <div className="bg-[var(--primary)] text-white p-8 rounded-2xl relative overflow-hidden shadow-xl">
                        <div className="relative z-10">
                            <h4 className="text-xl font-bold mb-2">Automated Recommendation</h4>
                            <p className="text-blue-100 text-sm leading-relaxed mb-6">
                                The AI Assessor recommends <strong className="text-white">Approval</strong> with a standard premium adjustment of -4.2% based on enhanced safety compliance.
                            </p>
                            <div className="flex gap-3">
                                <button className="flex-1 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-colors">
                                    Reject
                                </button>
                                <button className="flex-1 py-3 bg-white text-[var(--primary)] rounded-xl font-bold text-sm shadow-sm hover:bg-opacity-90 transition-colors">
                                    Approve Policy
                                </button>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--insurai-primary-container)] rounded-full blur-3xl opacity-50" />
                    </div>

                    {/* Attached Documents */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-4 rounded-xl ghost-border flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--insurai-surface-container-low)] rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)]">photo_library</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold">Site Survey Photos</p>
                                <p className="text-xs text-[var(--insurai-on-surface-variant)]">12 Files • Uploaded 2d ago</p>
                            </div>
                            <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)] text-lg cursor-pointer hover:text-[var(--primary)]">download</span>
                        </div>
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-4 rounded-xl ghost-border flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--insurai-surface-container-low)] rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)]">description</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold">Financial Audit 2023</p>
                                <p className="text-xs text-[var(--insurai-on-surface-variant)]">PDF • 4.2 MB</p>
                            </div>
                            <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)] text-lg cursor-pointer hover:text-[var(--primary)]">download</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location Context */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Location Context</h3>
                    <span className="text-sm text-[var(--insurai-on-surface-variant)]">452 Meridian Avenue, San Francisco, CA</span>
                </div>
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl overflow-hidden relative">
                    <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-500 text-6xl">map</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
