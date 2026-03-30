"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ClaimAnalysisPage() {
    return (
        <div className="pt-8 pb-12 px-6 lg:px-8 max-w-[1600px] mx-auto animate-fade-in font-['Manrope']">
            {/* Header Section */}
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider font-['Inter']">
                            GraphRAG Enabled
                        </span>
                        <span className="text-[var(--insurai-on-surface-variant)] text-sm font-['Inter']">
                            Claim ID: #CLM-88294-WX
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--insurai-on-surface)] font-['Manrope']">
                        Intelligence Interface
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 rounded-xl text-sm font-bold border border-[var(--insurai-outline-variant)]/20 hover:bg-[var(--insurai-surface-container-low)] transition-all">
                        Reject Claim
                    </button>
                    <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-br from-[var(--primary)] to-[var(--insurai-primary-container)] shadow-lg shadow-[var(--primary)]/20 hover:scale-105 active:scale-95 transition-all">
                        Approve for Payout
                    </button>
                </div>
            </header>

            {/* Intelligence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Source Data */}
                <div className="lg:col-span-5 space-y-8">
                    
                    {/* Incident Card */}
                    <section className="bg-[var(--insurai-surface-container-lowest)] rounded-xl p-8 shadow-sm border border-[var(--insurai-outline-variant)]/10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-[var(--primary)]">description</span>
                            <h2 className="text-lg font-bold tracking-tight">Incident Description</h2>
                        </div>
                        <div className="prose prose-slate prose-sm max-w-none text-[var(--insurai-on-surface-variant)] leading-relaxed space-y-4">
                            <p>
                                On the evening of October 14th, at approximately 21:45 EST, a localized microburst occurred near the claimant&apos;s property in suburban Georgia. High-velocity winds estimated at 75mph resulted in several large oak limbs detaching and impacting the primary residential structure&apos;s roof.
                            </p>
                            <p>
                                The claimant reports significant water ingress following the incident, causing damage to the master bedroom ceiling and hardwood flooring. Localized flooding was noted, but initial assessment suggests the primary cause was structural compromise of the roof rather than rising ground water.
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100/50">
                            <h4 className="text-xs font-bold uppercase tracking-widest font-['Inter'] text-slate-400 mb-4">
                                Supporting Evidence
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="aspect-square rounded-lg bg-slate-100 overflow-hidden group cursor-zoom-in">
                                    <img 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                        alt="Close-up of damaged roof shingles and a fallen tree branch after a storm" 
                                        src="https://images.unsplash.com/photo-1542451372-887e58f00122?auto=format&fit=crop&q=80&w=300"
                                    />
                                </div>
                                <div className="aspect-square rounded-lg bg-slate-100 overflow-hidden group cursor-zoom-in">
                                    <img 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                        alt="Interior damage showing water stains on a white ceiling" 
                                        src="https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=300"
                                    />
                                </div>
                                <div className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer flex items-center justify-center bg-slate-200">
                                    <span className="material-symbols-outlined text-slate-500">add</span>
                                    <span className="absolute bottom-2 text-[10px] font-bold uppercase font-['Inter'] text-slate-500">+12 more</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Policy Clause Context */}
                    <section className="bg-[var(--insurai-surface-container-low)] rounded-xl p-8 border border-[var(--insurai-outline-variant)]/10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-[var(--insurai-secondary)]">database</span>
                            <h2 className="text-lg font-bold tracking-tight">GraphRAG Policy Extraction</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-[var(--primary)] shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-[var(--primary)] uppercase font-['Inter']">Clause 4B: Weather Phenomena</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-100 dark:border-emerald-800">Match Confidence: 99.8%</span>
                                </div>
                                <p className="text-sm font-medium text-[var(--insurai-on-surface)] italic mb-3">
                                    "The policy covers direct physical loss caused by windstorm, including microbursts, provided the roof sustains actual damage."
                                </p>
                                <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors">
                                    <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                                    [View Original PDF - Page 42]
                                </button>
                            </div>
                            <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-slate-300 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase font-['Inter']">Clause 12.2: Exclusions</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-100 dark:border-slate-700">Match Confidence: 84.2%</span>
                                </div>
                                <p className="text-sm font-medium text-[var(--insurai-on-surface-variant)] mb-3">
                                    "Water damage resulting from rising ground water or external flooding is excluded unless specific flood riders are active."
                                </p>
                                <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
                                    <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                                    [View Original PDF - Page 108]
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: AI Analysis */}
                <div className="lg:col-span-7 space-y-8">
                    
                    {/* GraphRAG Intelligence View */}
                    <section className="bg-[var(--insurai-surface-container-lowest)] rounded-xl p-8 shadow-[0_20px_40px_rgba(26,27,31,0.04)] ring-1 ring-[var(--primary)]/5">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[var(--primary)]">psychology</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-extrabold tracking-tight font-['Manrope']">AI Analysis Engine</h2>
                                    <p className="text-xs font-medium text-slate-500 font-['Inter'] uppercase tracking-widest">Confidence Score: 98.4%</p>
                                </div>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                <span className="text-sm font-bold">Claim Valid</span>
                            </div>
                        </div>

                        {/* Highlight Box */}
                        <div className="bg-[var(--primary)]/5 rounded-2xl p-6 border border-[var(--primary)]/10 mb-8">
                            <h3 className="text-[var(--primary)] font-bold mb-2">Verdict: Claim valid under Section 4B: Weather Damage</h3>
                            <p className="text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                                GraphRAG cross-referenced meteorological data from the NOAA Georgia station with the incident timestamp. Local wind speeds of 78mph were confirmed. Structural graph mapping indicates the roof compromise directly caused the subsequent water ingress, nullifying the Flood Exclusion clause.
                            </p>
                        </div>

                        {/* Knowledge Graph Connection */}
                        <div className="mb-8">
                            <h4 className="text-xs font-bold uppercase tracking-widest font-['Inter'] text-slate-400 mb-6">Cross-Reference Graph</h4>
                            
                            <div className="relative bg-slate-900 h-80 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                                
                                {/* Interactive Simulation Elements */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
                                
                                {/* SVG for Connections (Animated looking) */}
                                <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                                    {/* These paths loosely trace the nodes assuming a standard wide container (approx 700x320) */}
                                    {/* Using flex nodes is better for responsiveness, but drawing fixed SVGs matches the HTML structure directly. */}
                                    {/* We will center the graph abstractly. */}
                                    <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="rgba(0,122,255,0.4)" strokeDasharray="4 2" strokeWidth="1.5"></line>
                                    <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="rgba(0,122,255,0.4)" strokeDasharray="4 2" strokeWidth="1.5"></line>
                                    <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="rgba(0,122,255,0.9)" strokeWidth="2"></line>
                                    <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="rgba(0,122,255,0.4)" strokeDasharray="4 2" strokeWidth="1.5"></line>
                                </svg>
                                
                                {/* Nodes */}
                                <div className="relative w-full h-full flex items-center justify-center">
                                    
                                    {/* Center Node */}
                                    <div className="relative flex flex-col items-center gap-2 z-20">
                                        <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,122,255,0.5)] relative">
                                            {/* We manually implement the pulse with tailwind animate-ping for ease, as the node-pulse class isn't in global css */}
                                            <div className="absolute inset-0 rounded-full bg-[var(--primary)]/30 animate-ping" style={{ animationDuration: '3s' }}></div>
                                            <span className="material-symbols-outlined text-2xl relative z-10">cyclone</span>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase font-['Inter'] text-white bg-slate-800 px-2 py-0.5 rounded">Incident Data</span>
                                    </div>
                                    
                                    {/* Surroundings */}
                                    {/* Weather Station */}
                                    <div className="absolute top-[15%] left-[10%] group cursor-pointer z-10">
                                        <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 px-3 py-2 rounded-lg transition-transform hover:scale-105">
                                            <span className="material-symbols-outlined text-sm text-blue-400">cloud</span>
                                            <span className="text-[10px] font-bold text-white whitespace-nowrap">Weather Station</span>
                                        </div>
                                    </div>
                                    
                                    {/* Geo-Fencing */}
                                    <div className="absolute bottom-[15%] left-[10%] group cursor-pointer z-10">
                                        <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 px-3 py-2 rounded-lg transition-transform hover:scale-105">
                                            <span className="material-symbols-outlined text-sm text-blue-400">location_on</span>
                                            <span className="text-[10px] font-bold text-white whitespace-nowrap">Geo-Fencing</span>
                                        </div>
                                    </div>
                                    
                                    {/* Policy Graph (Hover State with Tooltip) */}
                                    <div className="absolute top-[15%] right-[10%] group cursor-pointer z-30">
                                        <div className="flex items-center gap-2 bg-[var(--primary)] px-3 py-2 rounded-lg ring-2 ring-white/20 shadow-lg relative">
                                            <span className="material-symbols-outlined text-sm text-white">verified_user</span>
                                            <span className="text-[10px] font-bold text-white whitespace-nowrap">Policy Graph</span>
                                        </div>
                                        
                                        {/* Tooltip (Deep Tech Tooltip) - always visible for mockup parity, or group-hover if preferred. The HTML has it inline without classes to hide it, so we'll show it. */}
                                        <div className="absolute top-full -right-4 mt-3 w-48 bg-slate-800/95 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                <span className="text-[9px] font-mono text-slate-400">NODE_PROPERTIES</span>
                                            </div>
                                            <pre className="text-[10px] font-mono text-blue-300 leading-tight">
{`{
  "node_type": "Clause",
  "id": "4B",
  "source": "Neo4j",
  "trust": 0.998
}`}
                                            </pre>
                                        </div>
                                    </div>
                                    
                                    {/* Claim History */}
                                    <div className="absolute bottom-[15%] right-[10%] group cursor-pointer z-10">
                                        <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 px-3 py-2 rounded-lg transition-transform hover:scale-105">
                                            <span className="material-symbols-outlined text-sm text-blue-400">history</span>
                                            <span className="text-[10px] font-bold text-white whitespace-nowrap">Claim History</span>
                                        </div>
                                    </div>

                                </div>
                                
                                {/* Visualization Controls */}
                                <div className="absolute bottom-3 left-3 flex gap-2">
                                    <button className="w-6 h-6 rounded bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-xs">zoom_in</span>
                                    </button>
                                    <button className="w-6 h-6 rounded bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-xs">zoom_out</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* AI Reasoning Chain */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest font-['Inter'] text-slate-400">Reasoning Chain</h4>
                            <div className="space-y-1 relative">
                                <div className="absolute top-4 left-5 bottom-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                                
                                <div className="flex gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors rounded-lg z-10 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-1.5 ring-4 ring-white dark:ring-slate-950"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Structural Failure Validation</p>
                                        <p className="text-xs text-[var(--insurai-on-surface-variant)] mt-1">Computer Vision confirmed branch detachment diameter (~14in) exceeds structural limits of asphalt shingles.</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors rounded-lg z-10 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-1.5 ring-4 ring-white dark:ring-slate-950"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Causality Mapping</p>
                                        <p className="text-xs text-[var(--insurai-on-surface-variant)] mt-1">Temporal analysis shows water damage interior reported 2 hours post-impact. Direct causality established.</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors rounded-lg z-10 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-1.5 ring-4 ring-white dark:ring-slate-950"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Payout Calibration</p>
                                        <p className="text-xs text-[var(--insurai-on-surface-variant)] mt-1">Estimated repair costs ($14,200) match regional adjuster benchmarks for Georgia Q4.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>
                </div>
            </div>

            {/* Detail Tabs/Actions */}
            <footer className="mt-12 flex justify-center pb-8 border-b border-[var(--insurai-outline-variant)]/10">
                <div className="bg-[var(--insurai-surface-container-highest)]/50 backdrop-blur rounded-2xl p-1.5 inline-flex gap-1 shadow-sm border border-[var(--insurai-outline-variant)]/10">
                    <button className="px-6 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-[var(--primary)] shadow-sm transition-all focus:outline-none">All Analysis Results</button>
                    <button className="px-6 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-[var(--insurai-on-surface)] transition-all focus:outline-none">Claimant Profile</button>
                    <button className="px-6 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-[var(--insurai-on-surface)] transition-all focus:outline-none">Policy History</button>
                    <button className="px-6 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-[var(--insurai-on-surface)] transition-all focus:outline-none">Communication Logs</button>
                </div>
            </footer>
        </div>
    );
}
