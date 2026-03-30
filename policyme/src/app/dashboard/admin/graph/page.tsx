"use client";

import Link from "next/link";
import { useState } from "react";

export default function KnowledgeGraphPage() {
    return (
        <div className="flex-1 w-full bg-[var(--insurai-surface)] font-['Manrope'] px-6 md:px-10 py-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--insurai-on-surface)]">
                        Knowledge Graph Operations
                    </h1>
                    <p className="text-[var(--insurai-on-surface-variant)] leading-relaxed max-w-xl">
                        Monitor the policy ingestion pipeline, view Neo4j network topologies, and orchestrate global vector updates for semantic claim search.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest bg-[var(--insurai-surface-container-low)] text-[var(--insurai-on-surface)] border border-[var(--insurai-outline-variant)]/20 hover:bg-[var(--insurai-surface-container)] transition-colors uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">sync</span>
                        Reindex Nodes
                    </button>
                    <button className="px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest bg-[var(--primary)] text-white hover:bg-[var(--insurai-primary-container)] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl shadow-[var(--primary)]/20 uppercase border border-[var(--primary)]/50">
                        <span className="material-symbols-outlined text-[16px] animate-[spin_4s_linear_infinite]">upload_file</span>
                        Upload Documents
                    </button>
                </div>
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1. Large Topology Visualization Window */}
                <div className="lg:col-span-8 bg-[#0a0f18] rounded-2xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col min-h-[500px] relative group border-[var(--primary)]/10">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between text-white/80 absolute w-full z-20 backdrop-blur-md bg-[#0a0f18]/40">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-sm font-['Inter'] text-[var(--primary)]">hub</span>
                            <span className="text-xs font-bold font-['Manrope'] tracking-wider">NETWORK TOPOLOGY SIMULATION</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-['Inter'] font-bold text-emerald-400">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                            ACTIVE RENDER
                        </div>
                    </div>
                    
                    {/* SVG Simulation representation */}
                    <div className="flex-1 relative w-full h-[500px]">
                        <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 800 500">
                            {/* Underlying grid lines */}
                            <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#graph-grid)" />
                            
                            {/* Connection Lines (Relationships) */}
                            <path d="M400,250 L200,150" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]"></path>
                            <path d="M400,250 L600,150" stroke="rgba(0,82,209,0.3)" strokeWidth="3"></path>
                            <path d="M400,250 L300,400" stroke="rgba(0,82,209,0.3)" strokeWidth="3"></path>
                            <path d="M400,250 L550,380" stroke="rgba(255,255,255,0.1)" strokeWidth="2"></path>
                            <path d="M200,150 L100,200" stroke="rgba(255,255,255,0.1)" strokeWidth="1"></path>
                            <path d="M200,150 L250,50" stroke="rgba(255,255,255,0.1)" strokeWidth="1"></path>
                            <path d="M600,150 L750,200" stroke="rgba(0,82,209,0.2)" strokeWidth="2"></path>
                            <path d="M600,150 L680,80" stroke="rgba(0,82,209,0.4)" strokeWidth="2"></path>
                            <path d="M300,400 L200,450" stroke="rgba(0,82,209,0.3)" strokeWidth="2"></path>
                            <path d="M300,400 L420,480" stroke="rgba(0,82,209,0.3)" strokeWidth="2"></path>
                            <path d="M550,380 L650,450" stroke="rgba(255,255,255,0.1)" strokeWidth="1"></path>
                            <path d="M550,380 L700,320" stroke="rgba(255,255,255,0.1)" strokeWidth="1"></path>

                            {/* Center Node (Policy root) */}
                            <circle cx="400" cy="250" r="28" fill="rgba(8,15,31,0.8)" stroke="rgba(0,82,209,0.8)" strokeWidth="4" className="shadow-[0_0_30px_rgba(0,82,209,0.5)]"></circle>
                            <circle cx="400" cy="250" r="14" fill="var(--primary)" className="animate-pulse"></circle>
                            
                            {/* Primary Vector Nodes */}
                            <circle cx="200" cy="150" r="18" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"></circle>
                            <circle cx="600" cy="150" r="22" fill="rgba(0,82,209,0.1)" stroke="var(--primary)" strokeWidth="2" className="shadow-[0_0_15px_rgba(0,82,209,0.4)]"></circle>
                            <circle cx="300" cy="400" r="20" fill="rgba(0,82,209,0.1)" stroke="var(--primary)" strokeWidth="2"></circle>
                            <circle cx="550" cy="380" r="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"></circle>

                            {/* Data points traveling on vectors */}
                            <circle cx="200" cy="150" r="3" fill="var(--primary)" className="animate-[pulse_1s_infinite]">
                                <animateTransform attributeName="transform" type="translate" dur="4s" repeatCount="indefinite" values="0,0; 200,100; 200,100"></animateTransform>
                            </circle>
                            
                            {/* Secondary Leaf Nodes */}
                            <circle cx="100" cy="200" r="8" fill="rgba(255,255,255,0.4)"></circle>
                            <circle cx="250" cy="50" r="10" fill="rgba(255,255,255,0.4)"></circle>
                            <circle cx="750" cy="200" r="12" fill="var(--primary)"></circle>
                            <circle cx="680" cy="80" r="14" fill="rgba(0,82,209,0.8)"></circle>
                            <circle cx="200" cy="450" r="10" fill="rgba(0,82,209,0.6)"></circle>
                            <circle cx="420" cy="480" r="12" fill="rgba(0,82,209,0.6)"></circle>
                            <circle cx="650" cy="450" r="8" fill="rgba(255,255,255,0.4)"></circle>
                            <circle cx="700" cy="320" r="8" fill="rgba(255,255,255,0.4)"></circle>
                        </svg>

                        {/* Text labels floating above SVG */}
                        <div className="absolute top-[52%] left-[46%] w-min whitespace-nowrap text-[10px] font-bold text-white/90 bg-[#0a0f18]/80 px-2 py-1 rounded border border-white/10 backdrop-blur-sm pointer-events-none transition-all">
                            Policy_HO4_Master
                        </div>
                        <div className="absolute top-[28%] left-[76%] text-[9px] font-bold text-[var(--primary)] uppercase bg-[var(--primary)]/10 px-2 py-0.5 rounded border border-[var(--primary)]/30 pointer-events-none">
                            Water Damage
                        </div>
                        <div className="absolute top-[82%] left-[34%] text-[9px] font-bold text-[var(--primary)] uppercase bg-[var(--primary)]/10 px-2 py-0.5 rounded border border-[var(--primary)]/30 pointer-events-none">
                            Schedule A
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 bg-[#0a0f18]/80 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex justify-between items-center text-white">
                        <div>
                            <p className="text-[10px] font-['Inter'] uppercase tracking-widest text-slate-400 mb-1">Active Cluster</p>
                            <p className="text-sm font-bold font-['Manrope']">prod-graph-alpha-1</p>
                        </div>
                        <div className="flex gap-6">
                            <div className="text-center">
                                <p className="text-[10px] font-['Inter'] uppercase tracking-widest text-slate-400 mb-0.5">Vector Dimensions</p>
                                <p className="text-sm font-bold text-[var(--primary)]">1,536</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-['Inter'] uppercase tracking-widest text-slate-400 mb-0.5">Latency</p>
                                <p className="text-sm font-bold text-emerald-400">12ms</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Ingestion Pipeline List */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Pipeline Queue */}
                    <div className="bg-[var(--insurai-surface-container-lowest)] rounded-2xl p-6 border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(0,0,0,0.02)] flex-1">
                        <div className="flex items-center justify-between border-b border-[var(--insurai-outline-variant)]/10 pb-4 mb-4">
                            <h3 className="font-['Manrope'] font-bold text-lg">Ingestion Pipeline</h3>
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-[pulse_2s_infinite] shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Document 1 */}
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)] text-[18px]">picture_as_pdf</span>
                                        <p className="text-xs font-bold font-['Inter'] truncate max-w-[150px]">Commercial_Liability_Q3.pdf</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-[var(--primary)]">84%</span>
                                </div>
                                <div className="w-full h-1.5 bg-[var(--insurai-surface-container-high)] rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-[var(--primary)] rounded-full w-[84%] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-[var(--insurai-on-surface-variant)] font-['Inter'] uppercase tracking-wider">
                                    Step 3: Vectorizing Chunks (241/280)
                                </p>
                            </div>

                            {/* Document 2 */}
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)] text-[18px]">picture_as_pdf</span>
                                        <p className="text-xs font-bold font-['Inter'] truncate max-w-[150px]">Homeowner_HO3_Rider.pdf</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-500">42%</span>
                                </div>
                                <div className="w-full h-1.5 bg-[var(--insurai-surface-container-high)] rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-amber-500 rounded-full w-[42%] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-[var(--insurai-on-surface-variant)] font-['Inter'] uppercase tracking-wider">
                                    Step 2: Identifying Entities & Relationships
                                </p>
                            </div>

                            {/* Document 3 */}
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)] text-[18px]">description</span>
                                        <p className="text-xs font-bold font-['Inter'] truncate max-w-[150px]">State_Regulations_CA_2024.docx</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">In Queue</span>
                                </div>
                                <div className="w-full h-1.5 bg-[var(--insurai-surface-container-high)] rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-slate-300 w-[5%]"></div>
                                </div>
                                <p className="text-[10px] text-[var(--insurai-on-surface-variant)] font-['Inter'] uppercase tracking-wider">
                                    Waiting for OCR Pipeline
                                </p>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-2.5 rounded-lg border border-[var(--insurai-outline-variant)]/20 text-xs font-bold font-['Inter'] text-[var(--insurai-on-surface-variant)] hover:bg-[var(--insurai-surface-container-low)] transition-colors">
                            View Processing History
                        </button>
                    </div>

                    {/* Massive Action Button */}
                    <div className="bg-gradient-to-br from-[#003B91] to-[#0054d6] rounded-2xl p-6 relative overflow-hidden text-white shadow-[0_15px_30px_rgba(0,82,209,0.3)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group">
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <span className="material-symbols-outlined text-4xl mb-4 group-hover:rotate-180 transition-transform duration-700">cached</span>
                            <div>
                                <h4 className="text-xl font-bold font-['Manrope'] mb-1">Global Vector Refresh</h4>
                                <p className="text-xs font-medium font-['Inter'] opacity-80 leading-snug">
                                    Force sync all LLM embeddings against Neo4j production cluster.
                                </p>
                            </div>
                        </div>
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                        <div className="absolute right-4 bottom-4 w-12 h-12 border-2 border-white/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[16px]">arrow_forward</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Row - Complete Data List */}
            <div className="mt-6 bg-[var(--insurai-surface-container-lowest)] rounded-2xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="p-6 border-b border-[var(--insurai-surface-container-high)]">
                    <h3 className="text-lg font-bold font-['Manrope']">Recent Graph Conversions</h3>
                    <p className="text-xs text-[var(--insurai-on-surface-variant)]">Unstructured document corpus converted into queryable Neo4j semantic layers.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--insurai-surface-container-low)]/50 border-b border-[var(--insurai-outline-variant)]/5">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] font-['Inter']">Document Origin</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] font-['Inter']">Nodes Gen</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] font-['Inter']">Edges Formed</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] font-['Inter']">Duration</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] font-['Inter']">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--insurai-surface-container-highest)]/30">
                            
                            <tr className="hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 border border-red-100 dark:border-red-900/50">
                                            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[var(--insurai-on-surface)]">Auto_Insurance_Policy_TX.pdf</p>
                                            <p className="text-[10px] text-[var(--insurai-on-surface-variant)] font-['Inter'] mt-0.5">8.4 MB • 142 Pages</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-bold text-[var(--primary)]">1,402</td>
                                <td className="px-6 py-4 text-xs font-bold text-[var(--primary)]">12,841</td>
                                <td className="px-6 py-4 text-xs font-['Inter'] font-semibold text-[var(--insurai-on-surface-variant)]">02m 41s</td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                        Committed
                                    </span>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
