"use client";

import Link from "next/link";

const reasoningChain = [
    {
        title: "Structural Failure Validation",
        detail: "Computer Vision confirmed branch detachment diameter (~14in) exceeds structural limits of asphalt shingles.",
        color: "bg-blue-500",
    },
    {
        title: "Causality Mapping",
        detail: "Temporal analysis shows water damage interior reported 2 hours post-impact. Direct causality established.",
        color: "bg-blue-500",
    },
    {
        title: "Payout Calibration",
        detail: "Estimated repair costs ($14,200) match regional adjuster benchmarks for Georgia Q4.",
        color: "bg-blue-500",
    },
];

const clauses = [
    {
        label: "CLAUSE 4B: WEATHER PHENOMENA",
        confidence: "99.8%",
        confidenceColor: "text-green-600",
        quote: '"The policy covers direct physical loss caused by windstorm, including microbursts, provided the roof sustains actual damage."',
        source: "View Original PDF - Page 42",
    },
    {
        label: "CLAUSE 12.2: EXCLUSIONS",
        confidence: "84.2%",
        confidenceColor: "text-orange-500",
        quote: '"Water damage resulting from rising ground water or external flooding is excluded unless specific flood riders are active."',
        source: "View Original PDF - Page 108",
    },
];

export default function ClaimAnalysisPage() {
    return (
        <div className="pt-8 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-widest">
                                GraphRAG Enabled
                            </span>
                            <span className="text-sm text-[var(--insurai-on-surface-variant)] font-[Inter]">
                                Claim ID: #CLM-88294-WX
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter font-[Manrope]">
                            Intelligence Interface
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-5 py-2.5 rounded-lg border border-[var(--insurai-outline-variant)]/20 text-[var(--insurai-on-surface-variant)] font-medium hover:bg-[var(--insurai-surface-container-low)] transition-all">
                            Reject Claim
                        </button>
                        <button className="px-5 py-2.5 rounded-lg primary-gradient text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                            Approve for Payout
                        </button>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Left: Incident & Policy Extraction */}
                    <div className="space-y-8">
                        {/* Incident Description */}
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)]">description</span>
                                <h2 className="text-xl font-bold">Incident Description</h2>
                            </div>
                            <div className="space-y-4 text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                                <p>
                                    On the evening of October 14th, at approximately 21:45 EST, a localized microburst occurred near the claimant&apos;s property in suburban Georgia. High-velocity winds estimated at 75mph resulted in several large oak limbs detaching and impacting the primary residential structure&apos;s roof.
                                </p>
                                <p>
                                    The claimant reports significant water ingress following the incident, causing damage to the master bedroom ceiling and hardwood flooring. Localized flooding was noted, but initial assessment suggests the primary cause was structural compromise of the roof rather than rising ground water.
                                </p>
                            </div>

                            {/* Supporting Evidence */}
                            <div className="mt-8">
                                <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-4">
                                    Supporting Evidence
                                </p>
                                <div className="flex gap-3">
                                    <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-500 text-sm">image</span>
                                        </div>
                                    </div>
                                    <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-500 text-sm">image</span>
                                        </div>
                                    </div>
                                    <div className="w-20 h-20 bg-[var(--insurai-surface-container-low)] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[var(--insurai-surface-container)] transition-colors">
                                        <span className="text-xs font-bold text-[var(--insurai-on-surface-variant)]">+12 MORE</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* GraphRAG Policy Extraction */}
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-[var(--insurai-secondary)]">policy</span>
                                <h2 className="text-xl font-bold">GraphRAG Policy Extraction</h2>
                            </div>

                            <div className="space-y-6">
                                {clauses.map((clause, i) => (
                                    <div key={i} className="bg-[var(--insurai-surface-container-low)] p-6 rounded-xl">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--primary)]">
                                                {clause.label}
                                            </span>
                                            <span className={`text-xs font-bold ${clause.confidenceColor}`}>
                                                Match Confidence: {clause.confidence}
                                            </span>
                                        </div>
                                        <p className="text-sm italic text-[var(--insurai-on-surface-variant)] leading-relaxed mb-3">
                                            {clause.quote}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-[var(--primary)] font-medium cursor-pointer hover:underline">
                                            <span className="material-symbols-outlined text-sm">description</span>
                                            [{clause.source}]
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: AI Analysis */}
                    <div className="space-y-8">
                        {/* AI Analysis Engine Verdict */}
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-green-600 text-lg">psychology</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">AI Analysis Engine</h3>
                                        <p className="text-xs text-[var(--insurai-on-surface-variant)] font-[Inter]">
                                            Confidence Score: 98.4%
                                        </p>
                                    </div>
                                </div>
                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    Claim Valid
                                </span>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 mb-6">
                                <h4 className="font-bold text-[var(--primary)] mb-2">
                                    Verdict: Claim valid under Section 4B: Weather Damage
                                </h4>
                                <p className="text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                                    GraphRAG cross-referenced meteorological data from the NOAA Georgia station with the incident timestamp. Local wind speeds of 78mph were confirmed. Structural graph mapping indicates the roof compromise directly caused the subsequent water ingress, nullifying the Flood Exclusion clause.
                                </p>
                            </div>
                        </div>

                        {/* Cross-Reference Graph */}
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                            <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-4">
                                Cross-Reference Graph
                            </p>
                            <div className="bg-slate-800 rounded-xl p-6 h-56 relative overflow-hidden">
                                {/* Graph Visualization Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {/* Nodes */}
                                    <div className="absolute top-8 left-8">
                                        <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                                            <span className="material-symbols-outlined text-orange-300 text-sm">storm</span>
                                            <span className="text-xs font-bold text-orange-300">Weather Station</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-8 right-8">
                                        <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                                            <span className="material-symbols-outlined text-blue-300 text-sm">description</span>
                                            <span className="text-xs font-bold text-blue-300">Policy Graph</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-8 left-12">
                                        <div className="flex items-center gap-2 bg-green-500/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                                            <span className="material-symbols-outlined text-green-300 text-sm">location_on</span>
                                            <span className="text-xs font-bold text-green-300">Geo-Fencing</span>
                                        </div>
                                    </div>
                                    {/* Center Node */}
                                    <div className="bg-slate-700 border border-slate-600 rounded-lg p-3 shadow-xl z-10">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="w-2 h-2 bg-green-400 rounded-full" />
                                            <span className="text-[9px] text-green-400 font-bold uppercase">Node_Properties</span>
                                        </div>
                                        <div className="text-[10px] text-slate-300 font-mono space-y-0.5">
                                            <p>{`"node_type": "Clause"`}</p>
                                            <p>{`"id": "4B"`}</p>
                                            <p>{`"source": "Neo4j"`}</p>
                                            <p>{`"trust": 0.998`}</p>
                                        </div>
                                    </div>
                                    {/* SVG Lines would go here in production */}
                                </div>
                                {/* Zoom Controls */}
                                <div className="absolute bottom-3 left-3 flex gap-1">
                                    <button className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-slate-300 transition-colors">
                                        <span className="material-symbols-outlined text-sm">zoom_in</span>
                                    </button>
                                    <button className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-slate-300 transition-colors">
                                        <span className="material-symbols-outlined text-sm">zoom_out</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Reasoning Chain */}
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ghost-border">
                            <p className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-6">
                                Reasoning Chain
                            </p>
                            <div className="space-y-6">
                                {reasoningChain.map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 ${step.color} rounded-full mt-1.5`} />
                                            {i < reasoningChain.length - 1 && (
                                                <div className="w-px flex-1 bg-[var(--insurai-outline-variant)]/20 mt-2" />
                                            )}
                                        </div>
                                        <div className="pb-2">
                                            <h4 className="font-bold text-sm mb-1">{step.title}</h4>
                                            <p className="text-xs text-[var(--insurai-on-surface-variant)] leading-relaxed">
                                                {step.detail}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Tabs */}
                <div className="flex justify-center">
                    <div className="inline-flex bg-[var(--insurai-surface-container-low)] rounded-xl p-1.5 gap-1">
                        {["Analysis Results", "Claimant Info", "Policy History", "Communications"].map((tab, i) => (
                            <button
                                key={tab}
                                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                    i === 0
                                        ? "bg-white dark:bg-slate-800 shadow-sm text-[var(--primary)] font-bold"
                                        : "text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)]"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
        </div>
    );
}
