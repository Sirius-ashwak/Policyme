"use client";

import Link from "next/link";

export default function PortalDashboard() {
    return (
        <div className="animate-fade-in">
            {/* Welcome Header */}
            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--insurai-on-surface)] mb-2 font-[Manrope]">
                    Hello, Sarah Mitchell
                </h1>
                <p className="text-[var(--insurai-on-surface-variant)] text-lg max-w-2xl font-[Manrope] leading-relaxed">
                    Your portfolio is up to date. You have one claim under review and your premium for the Home Policy is due in 12 days.
                </p>
            </header>

            {/* Asymmetric Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* === Main Section === */}
                <section className="md:col-span-8 space-y-8">
                    {/* Active Policies Header */}
                    <div className="flex justify-between items-end mb-2">
                        <h2 className="text-2xl font-bold font-[Manrope]">Active Policies</h2>
                        <button className="text-[var(--primary)] font-[Inter] text-sm font-semibold hover:underline">
                            View all
                        </button>
                    </div>

                    {/* Policy Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Auto Policy */}
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ambient-shadow-hover ghost-border group cursor-pointer transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-[var(--primary)]">
                                    <span className="material-symbols-outlined">directions_car</span>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                    Active
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-1">Tesla Model 3</h3>
                            <p className="text-[var(--insurai-on-surface-variant)] text-sm font-[Inter] mb-6">
                                ID: AU-82910-XM
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--insurai-on-surface-variant)]">Total Coverage</span>
                                    <span className="font-bold">$100,000</span>
                                </div>
                                <div className="w-full bg-[var(--insurai-surface-container-high)] h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[var(--primary)] h-full w-3/4 rounded-full transition-all duration-1000" />
                                </div>
                            </div>
                        </div>

                        {/* Home Policy */}
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ambient-shadow ambient-shadow-hover ghost-border group cursor-pointer transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-[var(--insurai-tertiary)]">
                                    <span className="material-symbols-outlined">home</span>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                    Active
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-1">Main Residence</h3>
                            <p className="text-[var(--insurai-on-surface-variant)] text-sm font-[Inter] mb-6">
                                ID: HM-44012-BY
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--insurai-on-surface-variant)]">Premium Due</span>
                                    <span className="font-bold text-[var(--insurai-error)]">Oct 24, 2023</span>
                                </div>
                                <div className="w-full bg-[var(--insurai-surface-container-high)] h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[var(--insurai-tertiary)] h-full w-full rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Timeline */}
                    <div className="mt-12 bg-[var(--insurai-surface-container-low)] rounded-3xl p-8">
                        <h2 className="text-2xl font-bold font-[Manrope] mb-8">Recent Activity</h2>
                        <div className="space-y-8 relative before:content-[''] before:absolute before:left-[1.2rem] before:top-2 before:bottom-2 before:w-px before:bg-[var(--insurai-outline-variant)]/30">
                            {/* Claim Progress */}
                            <div className="relative pl-12">
                                <div className="absolute left-0 top-1 w-10 h-10 bg-[var(--insurai-surface-container-lowest)] rounded-full border-2 border-[var(--primary)] flex items-center justify-center z-10">
                                    <span className="material-symbols-outlined text-[var(--primary)] text-xl">description</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                    <div>
                                        <h4 className="font-bold text-lg">Active Claim: Windshield Damage</h4>
                                        <p className="text-[var(--insurai-on-surface-variant)] text-sm mt-1">
                                            Status: <span className="font-semibold text-[var(--primary)]">In Review</span> • Case #CL-90122
                                        </p>
                                    </div>
                                    <span className="text-xs font-[Inter] text-[var(--insurai-on-surface-variant)] bg-[var(--insurai-surface-container-highest)] px-3 py-1 rounded-full self-start">
                                        Today, 09:42 AM
                                    </span>
                                </div>
                                <p className="mt-4 text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                                    Our adjusters are verifying the quote from Safelite AutoGlass using our deterministic GraphRAG engine. We expect a decision within 24 hours.
                                </p>
                            </div>

                            {/* Application Progress */}
                            <div className="relative pl-12">
                                <div className="absolute left-0 top-1 w-10 h-10 bg-[var(--insurai-surface-container-lowest)] rounded-full border-2 border-[var(--insurai-secondary)] flex items-center justify-center z-10">
                                    <span className="material-symbols-outlined text-[var(--insurai-secondary)] text-xl">shield</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                    <div>
                                        <h4 className="font-bold text-lg">New Application: Pet Insurance</h4>
                                        <p className="text-[var(--insurai-on-surface-variant)] text-sm mt-1">
                                            Status: <span className="font-semibold text-[var(--insurai-secondary)]">Pending Underwriting</span>
                                        </p>
                                    </div>
                                    <span className="text-xs font-[Inter] text-[var(--insurai-on-surface-variant)] bg-[var(--insurai-surface-container-highest)] px-3 py-1 rounded-full self-start">
                                        Oct 10, 2023
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === Right Side: Insights & Concierge === */}
                <aside className="md:col-span-4 space-y-8">
                    
                    {/* Coverage Insight Card */}
                    <div className="bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/20 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center space-x-2 text-[var(--insurai-tertiary)] mb-4">
                            <span className="material-symbols-outlined">lightbulb</span>
                            <span className="text-xs font-bold uppercase tracking-widest font-[Inter]">Smart Insight</span>
                        </div>
                        <h3 className="text-lg font-bold mb-3">Gap Identified</h3>
                        <p className="text-[var(--insurai-on-surface-variant)] text-sm font-[Manrope] mb-6 leading-relaxed">
                            Based on your local weather patterns in San Francisco, we recommend adding <strong>Flood Coverage</strong> to your Home Policy.
                        </p>
                        
                        <div className="p-4 bg-[var(--insurai-surface-container-low)] rounded-xl mb-6 flex justify-between items-center transition-colors">
                            <span className="text-xs font-[Inter] font-medium text-[var(--insurai-on-surface-variant)]">Estimated Add-on</span>
                            <span className="font-bold text-[var(--primary)]">+$12.40/mo</span>
                        </div>
                        
                        <button className="w-full py-3 bg-[var(--insurai-surface-container-high)] hover:bg-[var(--insurai-surface-container-highest)] text-[var(--insurai-on-surface)] font-bold rounded-xl transition-colors">
                            Learn More
                        </button>
                    </div>

                    {/* Map Section (Policy Location) */}
                    <div className="bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/20 rounded-3xl overflow-hidden shadow-sm relative group cursor-pointer hover:border-[var(--primary)]/30 transition-colors">
                        <div className="h-48 bg-slate-200 dark:bg-slate-800 relative">
                            {/* We use a stock image that resembles the abstract map from the mockup */}
                            <img 
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" 
                                alt="Map View" 
                                className="w-full h-full object-cover grayscale opacity-70 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--insurai-surface-container-lowest)] via-transparent"></div>
                            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                                <div className="w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center shadow-lg">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                </div>
                                <span className="text-xs font-bold font-[Inter] bg-white/90 text-slate-800 px-3 py-1 rounded-full shadow-sm">
                                    Primary Residence
                                </span>
                            </div>
                        </div>
                        <div className="p-6 relative z-10">
                            <p className="text-sm font-bold text-[var(--insurai-on-surface)] mb-1">Oakwood Avenue Estate</p>
                            <p className="text-xs font-[Manrope] text-[var(--insurai-on-surface-variant)]">1248 Oakwood Ave, San Francisco, CA</p>
                        </div>
                    </div>
                    
                </aside>
            </div>
        </div>
    );
}
