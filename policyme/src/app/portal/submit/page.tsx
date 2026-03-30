"use client";

import { useState } from "react";
import Link from "next/link";

const steps = [
    { label: "Incident Details", key: "details" },
    { label: "Evidence", key: "evidence" },
    { label: "Review", key: "review" },
];

export default function SubmitClaimPage() {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="min-h-screen bg-[var(--insurai-surface)]">
            {/* Minimal Top Bar - Distraction Free */}
            <header className="fixed top-0 w-full z-50 bg-[var(--insurai-surface)]/80 backdrop-blur-[20px]">
                <div className="max-w-3xl mx-auto h-16 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/portal" className="flex items-center gap-2 text-[var(--primary)] hover:opacity-80 transition-opacity">
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span className="font-['Inter'] text-sm font-medium">Dashboard</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tighter text-[var(--insurai-on-surface)]">InsurAI</span>
                    </div>
                    <div className="w-24 flex justify-end">
                        <button className="text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors">
                            <span className="material-symbols-outlined">help_outline</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-20 px-6">
                <div className="max-w-xl mx-auto animate-fade-in font-['Manrope']">
                    
                    {/* Step Indicator */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--insurai-on-surface)]">File New Claim</h1>
                            <span className="font-['Inter'] text-xs font-semibold text-[var(--primary)] bg-[var(--insurai-primary-fixed)]/30 px-3 py-1 rounded-full">
                                Step {currentStep + 1} of {steps.length}
                            </span>
                        </div>
                        
                        <div className="flex gap-2 h-1.5 w-full">
                            {steps.map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`flex-1 rounded-full transition-colors duration-500 bg-gradient-to-r ${
                                        i <= currentStep ? "from-[var(--primary)] to-[var(--primary)]" : "from-[var(--insurai-surface-container-high)] to-[var(--insurai-surface-container-high)]"
                                    }`} 
                                />
                            ))}
                        </div>
                        
                        <div className="flex justify-between mt-3">
                            {steps.map((step, i) => (
                                <span 
                                    key={step.key} 
                                    className={`font-['Inter'] text-[10px] font-bold uppercase tracking-widest ${
                                        i <= currentStep ? "text-[var(--primary)]" : "text-[var(--insurai-on-surface-variant)] opacity-40"
                                    }`}
                                >
                                    {step.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="space-y-10">
                        {/* Step 1: Basic Info */}
                        <div className={currentStep === 0 ? "block" : "hidden"}>
                            <section className="space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold">Incident Details</h2>
                                    <p className="text-[var(--insurai-on-surface-variant)] text-sm">Tell us what happened with your protected asset.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    
                                    {/* Incident Type */}
                                    <div className="space-y-2">
                                        <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">Type of Claim</label>
                                        <div className="relative">
                                            <select className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 appearance-none font-medium text-[var(--insurai-on-surface)] cursor-pointer focus:ring-4 focus:ring-[var(--primary)]/10">
                                                <option>Select incident type</option>
                                                <option>Vehicle Collision</option>
                                                <option>Property Damage</option>
                                                <option>Theft / Burglary</option>
                                                <option>Natural Disaster</option>
                                                <option>Medical Emergency</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--insurai-on-surface-variant)]">
                                                <span className="material-symbols-outlined">unfold_more</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Date and Time */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">Date of Incident</label>
                                            <div className="relative">
                                                <input type="date" className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 font-medium text-[var(--insurai-on-surface)] focus:ring-4 focus:ring-[var(--primary)]/10" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">Approx. Time</label>
                                            <div className="relative">
                                                <input type="time" className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 font-medium text-[var(--insurai-on-surface)] focus:ring-4 focus:ring-[var(--primary)]/10" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="font-['Inter'] text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider ml-1 block">Incident Description</label>
                                        <textarea 
                                            className="w-full bg-[var(--insurai-surface-container-highest)]/40 border-none rounded-xl py-4 px-4 font-medium text-[var(--insurai-on-surface)] resize-none placeholder:text-[var(--insurai-on-surface-variant)]/50 focus:ring-4 focus:ring-[var(--primary)]/10" 
                                            placeholder="Provide a detailed account of the events leading up to the incident..." 
                                            rows={5} 
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: File Upload */}
                            <section className="space-y-6 mt-10">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold">Supporting Evidence</h2>
                                    <p className="text-[var(--insurai-on-surface-variant)] text-sm">Upload photos of the damage or relevant documents.</p>
                                </div>
                                
                                <div className="group relative">
                                    <div className="border-2 border-dashed border-[var(--insurai-outline-variant)]/30 rounded-2xl p-10 flex flex-col items-center justify-center bg-[var(--insurai-surface-container-low)] transition-all group-hover:bg-[var(--insurai-surface-container)] cursor-pointer">
                                        <div className="w-16 h-16 rounded-full bg-[var(--insurai-primary-container)]/10 flex items-center justify-center text-[var(--primary)] mb-4 group-hover:scale-105 transition-transform">
                                            <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                        </div>
                                        <p className="font-semibold mb-1">Drag and drop files here</p>
                                        <p className="text-[var(--insurai-on-surface-variant)] text-xs mb-6">PNG, JPG or PDF up to 10MB each</p>
                                        <button className="bg-white dark:bg-slate-800 border border-[var(--insurai-outline-variant)]/20 px-6 py-2.5 rounded-lg font-['Inter'] text-sm font-semibold shadow-sm group-hover:-translate-y-0.5 active:scale-95 transition-all text-slate-700 dark:text-slate-200">
                                            Browse Files
                                        </button>
                                    </div>
                                    <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                                
                                {/* File List (Simulated) */}
                                <div className="space-y-2 mt-4">
                                    <div className="flex items-center justify-between p-4 bg-[var(--insurai-surface-container-lowest)] rounded-xl shadow-sm border border-[var(--insurai-outline-variant)]/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-[var(--insurai-surface-container-high)] overflow-hidden">
                                                <img 
                                                    className="w-full h-full object-cover grayscale opacity-80" 
                                                    alt="blurred close-up of car bumper damage" 
                                                    src="https://images.unsplash.com/photo-1542451372-887e58f00122?w=100&h=100&fit=crop"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">damage_front_right.jpg</p>
                                                <p className="text-[10px] text-[var(--insurai-on-surface-variant)] uppercase tracking-tighter">1.2 MB • Uploading 80%</p>
                                            </div>
                                        </div>
                                        <button className="text-[var(--insurai-on-surface-variant)] hover:text-red-500 transition-colors">
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Step 2/3 Placeholders for interactivity */}
                        <div className={currentStep === 1 ? "block" : "hidden"}>
                             <div className="space-y-6">
                                <h2 className="text-lg font-bold">Additional Evidence</h2>
                                <div className="border border-[var(--insurai-outline-variant)]/20 rounded-xl p-8 bg-[var(--insurai-surface-container-lowest)]">
                                     <p className="text-sm text-[var(--insurai-on-surface-variant)] text-center">More documents can be specified here.</p>
                                </div>
                             </div>
                        </div>
                        <div className={currentStep === 2 ? "block" : "hidden"}>
                             <div className="space-y-6">
                                <h2 className="text-lg font-bold">Review Claim</h2>
                                <div className="border border-[var(--insurai-outline-variant)]/20 rounded-xl p-8 bg-[var(--insurai-surface-container-lowest)]">
                                     <h3 className="font-bold border-b border-[var(--insurai-surface-container-high)] pb-4 mb-4">Summary</h3>
                                     <div className="flex justify-between text-sm py-2">
                                         <span className="text-[var(--insurai-on-surface-variant)]">Claim Type</span>
                                         <span className="font-semibold">Vehicle Collision</span>
                                     </div>
                                </div>
                             </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-10 flex items-center justify-between">
                            <button 
                                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                className="px-6 py-4 font-['Inter'] text-sm font-bold text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors flex items-center gap-2"
                            >
                                {currentStep === 0 ? "Save for later" : "Back"}
                            </button>
                            <button 
                                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                                className="bg-gradient-to-br from-[var(--primary)] to-[var(--insurai-primary-container)] px-10 py-4 rounded-xl text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                {currentStep === steps.length - 1 ? "Submit Claim" : "Continue"}
                            </button>
                        </div>
                        
                        {/* Security/Trust Badge */}
                        <div className="flex items-center justify-center gap-2 pt-8 opacity-40">
                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest font-['Inter']">End-to-End Encrypted Secure Submission</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="max-w-xl mx-auto py-10 px-6 text-center border-t border-[var(--insurai-outline-variant)]/10">
                <p className="text-[11px] text-[var(--insurai-on-surface-variant)]/60 font-medium">
                    © 2024 InsurAI Financial Services. All claims are subject to verification and policy terms.
                </p>
            </footer>
        </div>
    );
}
