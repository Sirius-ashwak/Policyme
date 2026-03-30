"use client";

import Link from "next/link";

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

export default function UnderwriterDashboard() {
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
                        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors">
                            Run Auto-Batch
                        </button>
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold border border-white/20 transition-colors">
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
                        className="w-full pl-12 pr-4 py-3 bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/15 rounded-xl text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--insurai-on-surface-variant)] hover:bg-[var(--insurai-surface-container-low)] rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-lg">tune</span>
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--insurai-on-surface-variant)] hover:bg-[var(--insurai-surface-container-low)] rounded-lg transition-colors">
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
                        {applicants.map((app) => (
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
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--insurai-surface-container-high)]">
                    <span className="text-xs text-[var(--insurai-on-surface-variant)]">Showing 1 to 10 of 124 results</span>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-lg border border-[var(--insurai-outline-variant)]/20 flex items-center justify-center text-[var(--insurai-on-surface-variant)] hover:bg-[var(--insurai-surface-container-low)] transition-colors">
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 rounded-lg border border-[var(--insurai-outline-variant)]/20 flex items-center justify-center text-[var(--insurai-on-surface-variant)] hover:bg-[var(--insurai-surface-container-low)] transition-colors">
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
                                Score &gt; <span className="text-[var(--primary)]">85</span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--insurai-on-surface-variant)]">Auto-approve active</span>
                            <div className="w-11 h-6 bg-[var(--primary)] rounded-full relative cursor-pointer">
                                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md" />
                            </div>
                        </div>
                        <button className="w-full py-3 bg-[var(--insurai-surface-container-high)] text-[var(--insurai-on-surface)] font-bold rounded-xl hover:bg-[var(--insurai-surface-container-highest)] transition-colors mt-4">
                            Adjust Global Threshold
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
